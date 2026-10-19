(() => {
    // 1. BANCOS DE PERGUNTAS SÓLIDOS EM JS (50 Perguntas)
    const baseBanks = {
        webdev: Array.from({length: 50}, (_, i) => ({
            id: i+1, text: `(Web) Pergunta ${i+1}: Qual a tag ou conceito correto em Desenvolvimento Web?`,
            options: [`Opção Correta para Q${i+1}`, "Tag incorreta A", "Tag incorreta B", "Tag incorreta C"], correct: 0
        })),
        sql: Array.from({length: 50}, (_, i) => ({
            id: i+1, text: `(SQL) Pergunta ${i+1}: Qual o comando SQL correto para gerir dados?`,
            options: [`SELECT / INSERT Q${i+1}`, "DROP INDEX", "ALTER SCHEMA", "DISCONNECT"], correct: 0
        })),
        networks: Array.from({length: 50}, (_, i) => ({
            id: i+1, text: `(Redes) Pergunta ${i+1}: No modelo OSI, qual o protocolo aplicável?`,
            options: [`Protocolo / Camada Q${i+1}`, "Cabo Par Trançado", "Hub Simples", "Repetidor"], correct: 0
        }))
    };

    baseBanks.webdev[0] = {id: 1, text: "O que significa HTML?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks Text", "Hyper Tool"], correct: 0};
    baseBanks.webdev[1] = {id: 2, text: "Em CSS, qual propriedade altera a cor do texto?", options: ["text-color", "color", "font-color", "fgcolor"], correct: 1};
    baseBanks.webdev[2] = {id: 3, text: "Como se declara uma variável em JavaScript moderno?", options: ["variable x;", "let x;", "v x;", "str x;"], correct: 1};

    let activeQuestionsBank = [];

    function loadCustomThemesDropdown() {
        const group = document.getElementById('customThemesGroup');
        group.innerHTML = '';
        let saved = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
        for(let name in saved) {
            let opt = document.createElement('option');
            opt.value = "custom_" + name;
            opt.textContent = `⭐ ${name} (${saved[name].length} q)`;
            group.appendChild(opt);
        }
    }
    loadCustomThemesDropdown();

    // 2. MQTT SETUP
    const brokerUrl = 'wss://test.mosquitto.org:8081';
    let client = mqtt.connect(brokerUrl);
    let roomCode = '', myId = '', isTeacher = false;
    let liveStudentsData = {}, submissionsData = [];
    
    let myTestQuestions = [], studentAnswers = [], myInfractions = [];
    let currentQIndex = 0, timeRemainingSeconds = 0, timerInterval = null;
    let currentState = 'A_AGUARDAR';
    let downloadedBank = null; // Armazena as perguntas sacadas da sala pelo aluno

    client.on('connect', () => {
        document.getElementById('connStatus').innerHTML = '<i class="fa-solid fa-check"></i> Ligado com sucesso.';
        document.getElementById('connStatus').style.color = 'var(--success)';
        document.getElementById('btnStartTest').disabled = false;
    });

    // SEGURANÇA
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if(e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) {
            e.preventDefault(); triggerAntiCheat("Tentativa de Inspeção de Código");
        }
    });

    // NAVEGAÇÃO
    document.getElementById('btnStudentView').addEventListener('click', () => {
        isTeacher = false; document.getElementById('studentView').classList.remove('hidden'); document.getElementById('teacherView').classList.add('hidden');
    });
    document.getElementById('btnTeacherView').addEventListener('click', () => document.getElementById('teacherAuthModal').classList.remove('hidden'));
    document.getElementById('btnCancelAuth').addEventListener('click', () => document.getElementById('teacherAuthModal').classList.add('hidden'));

    document.getElementById('btnSubmitAuth').addEventListener('click', () => {
        const pass = document.getElementById('teacherPasswordInput').value;
        const code = document.getElementById('teacherRoomInput').value.trim();
        const themeKey = document.getElementById('teacherBankSelect').value;

        if(!code) return alert("Insira o código da sala!");
        if(pass === 'admin') {
            document.getElementById('teacherAuthModal').classList.add('hidden');
            document.getElementById('teacherView').classList.remove('hidden');
            document.getElementById('studentView').classList.add('hidden');
            isTeacher = true; roomCode = code;
            document.getElementById('displayRoomCode').textContent = roomCode;

            if(themeKey.startsWith("custom_")) {
                let saved = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
                activeQuestionsBank = saved[themeKey.replace("custom_", "")] || [];
            } else {
                activeQuestionsBank = JSON.parse(JSON.stringify(baseBanks[themeKey] || []));
            }

            // Publica com retain para garantir que qualquer aluno que entre saiba as perguntas
            client.publish(`quizguard/${roomCode}/questions`, JSON.stringify(activeQuestionsBank), {retain: true});
            client.subscribe(`quizguard/${roomCode}/std/+`);
            client.subscribe(`quizguard/${roomCode}/sub/+`);
        } else {
            document.getElementById('authError').classList.remove('hidden');
        }
    });

    // 3. GESTÃO E EDIÇÃO DE PERGUNTAS (PROFESSOR CORRIGIDA)
    document.getElementById('btnManageQuestions').addEventListener('click', () => {
        document.getElementById('qManagerModal').classList.remove('hidden');
        renderQuestionsTable();
    });
    document.getElementById('btnCloseQManager').addEventListener('click', () => {
        document.getElementById('qManagerModal').classList.add('hidden');
        // ATUALIZAÇÃO CRUCIAL: Publica imediatamente as alterações para a sala
        client.publish(`quizguard/${roomCode}/questions`, JSON.stringify(activeQuestionsBank), {retain: true});
        alert("Alterações guardadas e sincronizadas com a sala!");
    });

    function renderQuestionsTable() {
        const tbody = document.getElementById('questionsTable').querySelector('tbody');
        tbody.innerHTML = '';
        activeQuestionsBank.forEach(q => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${q.id}</td><td>${q.text}</td><td>
                <button class="btn warning btn-icon" onclick="window.editQ(${q.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn danger btn-icon" onclick="window.deleteQ(${q.id})"><i class="fa-solid fa-trash"></i></button>
            </td>`;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('btnSaveQuestion').addEventListener('click', () => {
        const id = document.getElementById('editQId').value;
        const txt = document.getElementById('editQText').value;
        const opts = [document.getElementById('editOpt0').value, document.getElementById('editOpt1').value, document.getElementById('editOpt2').value, document.getElementById('editOpt3').value];
        const correct = parseInt(document.getElementById('editQCorrect').value);

        if(!txt || opts.some(o => !o)) return alert("Preencha o texto e todas as 4 opções.");

        if(id) {
            let q = activeQuestionsBank.find(x => x.id == id);
            q.text = txt; q.options = opts; q.correct = correct;
        } else {
            let newId = activeQuestionsBank.length ? Math.max(...activeQuestionsBank.map(b=>b.id)) + 1 : 1;
            activeQuestionsBank.push({id: newId, text: txt, options: opts, correct: correct});
        }
        renderQuestionsTable();
        document.getElementById('editQId').value = '';
        document.querySelectorAll('#qManagerModal input[type="text"]').forEach(i => i.value = '');
    });

    document.getElementById('btnSaveCustomTheme').addEventListener('click', () => {
        let name = prompt("Nome para guardar este banco de perguntas:");
        if(!name) return;
        let saved = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
        saved[name] = activeQuestionsBank;
        localStorage.setItem('qg_custom_banks', JSON.stringify(saved));
        loadCustomThemesDropdown();
        alert("Tema guardado com sucesso!");
    });

    window.editQ = (id) => {
        let q = activeQuestionsBank.find(x => x.id == id);
        document.getElementById('editQId').value = q.id;
        document.getElementById('editQText').value = q.text;
        document.getElementById('editOpt0').value = q.options[0];
        document.getElementById('editOpt1').value = q.options[1];
        document.getElementById('editOpt2').value = q.options[2];
        document.getElementById('editOpt3').value = q.options[3];
        document.getElementById('editQCorrect').value = q.correct;
    };
    window.deleteQ = (id) => {
        activeQuestionsBank = activeQuestionsBank.filter(x => x.id != id);
        renderQuestionsTable();
    };

    // 4. MENSAGENS MQTT E COMANDOS
    client.on('message', (topic, payload) => {
        const msg = payload.toString();
        const parts = topic.split('/');

        if(parts[2] === 'questions' && !isTeacher) {
            downloadedBank = JSON.parse(msg);
        }

        if(parts[2] === 'cmd' && parts[3] === myId && !isTeacher) {
            let cmd = JSON.parse(msg);
            if(cmd.action === 'start_test') {
                currentState = 'EM_TESTE';
                document.getElementById('studentWaitModal').classList.add('hidden');
                document.getElementById('studentLockModal').classList.add('hidden');
                startTimer(); publishState();
                try { document.documentElement.requestFullscreen(); } catch(e){}
            } else if(cmd.action === 'unlock' || cmd.action === 'unlock_time') {
                if(cmd.action === 'unlock_time') timeRemainingSeconds -= cmd.amount;
                currentState = 'EM_TESTE';
                document.getElementById('studentLockModal').classList.add('hidden');
                publishState();
                try { document.documentElement.requestFullscreen(); } catch(e){}
            } else if(cmd.action === 'force_pause') {
                currentState = 'PAUSADO';
                document.getElementById('lockTitleText').textContent = "TESTE PAUSADO";
                document.getElementById('lockReasonText').textContent = "O professor congelou o seu ecrã para verificação.";
                document.getElementById('studentLockModal').classList.remove('hidden');
                publishState();
            } else if(cmd.action === 'kick') {
                currentState = 'EXPULSO';
                clearInterval(timerInterval);
                document.getElementById('studentQuizCard').classList.add('hidden');
                document.getElementById('studentLockModal').classList.add('hidden');
                document.getElementById('studentWaitModal').classList.add('hidden');
                document.getElementById('studentKickedModal').classList.remove('hidden');
                client.publish(`quizguard/${roomCode}/std/${myId}`, '', {retain: true});
                try { document.exitFullscreen(); } catch(e){}
            }
        }

        if(parts[2] === 'std' && isTeacher) {
            if(!msg) delete liveStudentsData[parts[3]]; else liveStudentsData[parts[3]] = JSON.parse(msg);
            renderTeacherRadar();
        }
        if(parts[2] === 'sub' && isTeacher) {
            submissionsData.push(JSON.parse(msg));
            renderSubmissions();
        }
    });

    // 5. ENTRADA DO ALUNO CORRIGIDA (GARANTE O DOWNLOAD DAS PERGUNTAS)
    document.getElementById('btnStartTest').addEventListener('click', () => {
        roomCode = document.getElementById('studentRoomCode').value.trim();
        const name = document.getElementById('studentName').value.trim();
        if(!roomCode || !name) return alert("Insira a sala e o nome.");

        // Subscreve ao tópico de perguntas da sala específica
        client.subscribe(`quizguard/${roomCode}/questions`);
        document.getElementById('btnStartTest').innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> A ligar à sala...";

        // Aguarda 1 segundo para receber a mensagem retain do MQTT com as perguntas
        setTimeout(() => {
            if(!downloadedBank || downloadedBank.length === 0) {
                alert("A sala não foi encontrada ou ainda não tem perguntas carregadas pelo professor.");
                document.getElementById('btnStartTest').innerHTML = "Entrar na Sala (F11)";
                return;
            }

            let limit = downloadedBank.length >= 30 ? 30 : downloadedBank.length;
            myTestQuestions = downloadedBank.sort(() => 0.5 - Math.random()).slice(0, limit);
            studentAnswers = new Array(limit).fill(null);
            document.getElementById('totalQNum').textContent = limit;

            myId = 'STD_' + Date.now();
            document.getElementById('displayStudentName').textContent = name;
            client.subscribe(`quizguard/${roomCode}/cmd/${myId}`);
            
            timeRemainingSeconds = (document.getElementById('settingDuration').value || 30) * 60;

            document.getElementById('studentRegCard').classList.add('hidden');
            document.getElementById('studentQuizCard').classList.remove('hidden');

            currentState = 'A_AGUARDAR';
            document.getElementById('studentWaitModal').classList.remove('hidden');
            
            injectQuestionJS(0);
            publishState();
        }, 1200);
    });

    function publishState() {
        if(!roomCode || !myId) return;
        client.publish(`quizguard/${roomCode}/std/${myId}`, JSON.stringify({
            id: myId, name: document.getElementById('studentName').value,
            status: currentState, currentQ: currentQIndex + 1, infractions: myInfractions
        }), {retain: true});
    }

    // INJEÇÃO JS DAS PERGUNTAS
    function injectQuestionJS(index) {
        currentQIndex = index;
        const q = myTestQuestions[index];
        document.getElementById('currentQNum').textContent = index + 1;
        document.getElementById('quizProgressBar').style.width = `${((index + 1) / myTestQuestions.length) * 100}%`;

        let html = `<h3>${index + 1}. ${q.text}</h3><div class="options-list">`;
        q.options.forEach((opt, i) => {
            let isChecked = studentAnswers[index] === i ? 'checked' : '';
            html += `<label class="option-label ${isChecked ? 'selected' : ''}">
                <input type="radio" name="js_qopt" value="${i}" ${isChecked}> ${opt}
            </label>`;
        });
        html += `</div>`;

        document.getElementById('dynamicQuizContainer').innerHTML = html;

        document.querySelectorAll('input[name="js_qopt"]').forEach(r => {
            r.addEventListener('change', (e) => {
                document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
                e.target.closest('.option-label').classList.add('selected');
                studentAnswers[currentQIndex] = parseInt(e.target.value);
                publishState();
            });
        });

        document.getElementById('btnPrevQ').disabled = index === 0;
        if(index === myTestQuestions.length - 1) {
            document.getElementById('btnNextQ').classList.add('hidden');
            document.getElementById('btnSubmitTest').classList.remove('hidden');
        } else {
            document.getElementById('btnNextQ').classList.remove('hidden');
            document.getElementById('btnSubmitTest').classList.add('hidden');
        }
    }

    // ANTI-CHEAT
    window.addEventListener('blur', () => triggerAntiCheat("Saiu da aba (Alt-Tab / Foco)"));
    document.addEventListener('visibilitychange', () => { if(document.hidden) triggerAntiCheat("Minimizou o navegador"); });
    document.addEventListener('fullscreenchange', () => { if(!document.fullscreenElement) triggerAntiCheat("Saiu do modo ecrã inteiro"); });

    function triggerAntiCheat(reason) {
        if(currentState !== 'EM_TESTE') return;
        currentState = 'BLOQUEADO';
        myInfractions.push({ time: new Date().toLocaleTimeString(), reason: reason });
        document.getElementById('lockTitleText').textContent = "TESTE BLOQUEADO";
        document.getElementById('lockReasonText').textContent = "Motivo: " + reason;
        document.getElementById('studentLockModal').classList.remove('hidden');
        publishState();
    }

    document.getElementById('btnNextQ').addEventListener('click', () => {
        if(currentQIndex < myTestQuestions.length - 1) injectQuestionJS(currentQIndex + 1);
        publishState();
    });
    document.getElementById('btnPrevQ').addEventListener('click', () => {
        if(currentQIndex > 0) injectQuestionJS(currentQIndex - 1);
        publishState();
    });

    function startTimer() {
        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if(currentState !== 'EM_TESTE') return;
            timeRemainingSeconds--;
            if(timeRemainingSeconds <= 0) {
                submitTest("Tempo Esgotado");
            } else {
                let m = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0');
                let s = (timeRemainingSeconds % 60).toString().padStart(2, '0');
                document.getElementById('timeLeft').textContent = `${m}:${s}`;
            }
        }, 1000);
    }

    document.getElementById('btnSubmitTest').addEventListener('click', () => {
        if(confirm("Deseja submeter e terminar o teste?")) submitTest("Submissão Voluntária");
    });

    function submitTest(reason) {
        clearInterval(timerInterval);
        currentState = 'TERMINADO';
        let val = 20 / myTestQuestions.length, penalty = val / 4;
        let c = 0, w = 0, b = 0;
        studentAnswers.forEach((ans, idx) => {
            if(ans === null) b++;
            else if(ans === myTestQuestions[idx].correct) c++;
            else w++;
        });
        let finalScore = Math.max(0, (c * val) - (w * penalty)).toFixed(2);

        client.publish(`quizguard/${roomCode}/sub/${myId}`, JSON.stringify({
            id: myId, name: document.getElementById('studentName').value, score: finalScore,
            details: `${c} Certas, ${w} Erradas, ${b} Brancas`, infractions: myInfractions, status: reason
        }));
        client.publish(`quizguard/${roomCode}/std/${myId}`, '', {retain: true});

        document.getElementById('studentQuizCard').classList.add('hidden');
        document.getElementById('studentLockModal').classList.add('hidden');
        document.getElementById('studentResultCard').classList.remove('hidden');
        document.getElementById('finalScoreVal').textContent = finalScore;
        document.getElementById('scoreDetailsText').textContent = `${c} Certas | ${w} Erradas | ${b} Brancas`;
        try { document.exitFullscreen(); } catch(e){}
    }

    // 6. PROFESSOR RADAR
    function renderTeacherRadar() {
        const tbody = document.getElementById('liveStudentsTable').querySelector('tbody');
        tbody.innerHTML = '';
        const students = Object.values(liveStudentsData);
        if(students.length === 0) { tbody.innerHTML = `<tr><td colspan="4">Nenhum aluno ativo.</td></tr>`; return; }

        students.forEach(s => {
            let tr = document.createElement('tr');
            let statusBadge = '', actions = '';

            if(s.status === 'A_AGUARDAR') {
                tr.style.background = "rgba(59, 130, 246, 0.1)";
                statusBadge = `<span class="live-badge" style="background:var(--info)">Na Sala de Espera</span>`;
                actions = `<button class="btn success btn-icon" onclick="window.tCmd('${s.id}', 'start_test')"><i class="fa-solid fa-play"></i> Iniciar</button>
                           <button class="btn danger btn-icon" onclick="window.tCmd('${s.id}', 'kick')"><i class="fa-solid fa-door-open"></i> Expulsar</button>`;
            } else if(s.status === 'BLOQUEADO' || s.status === 'PAUSADO') {
                tr.style.background = "rgba(239, 68, 68, 0.1)";
                statusBadge = `<span class="live-badge" style="background:var(--danger)">${s.status}</span><br><small style="color:red;">${s.infractions.length ? s.infractions[s.infractions.length-1].reason : 'Congelado'}</small>`;
                
                actions = `<div class="action-group">
                    <button class="btn success btn-icon" title="Desbloquear" onclick="window.tCmd('${s.id}', 'unlock')"><i class="fa-solid fa-play"></i> Desbloquear</button>
                    <button class="btn warning btn-icon" title="Desbloquear tirando tempo" onclick="window.tCmd('${s.id}', 'unlock_time')"><i class="fa-solid fa-clock-rotate-left"></i> (- Tempo)</button>
                    <button class="btn danger btn-icon" title="Expulsar" onclick="window.tCmd('${s.id}', 'kick')"><i class="fa-solid fa-door-open"></i> Expulsar</button>
                </div>`;
            } else {
                statusBadge = `<span class="live-badge">A Fazer Teste</span>`;
                actions = `<div class="action-group">
                    <button class="btn warning btn-icon" title="Pausar Ecrã" onclick="window.tCmd('${s.id}', 'force_pause')"><i class="fa-solid fa-hand"></i> Pausar</button>
                    <button class="btn danger btn-icon" title="Expulsar" onclick="window.tCmd('${s.id}', 'kick')"><i class="fa-solid fa-door-open"></i> Expulsar</button>
                </div>`;
            }

            tr.innerHTML = `<td><strong>${s.name}</strong></td><td>${statusBadge}</td><td><strong style="color:var(--primary);">P. ${s.currentQ}/30</strong></td><td>${actions}</td>`;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('btnStartAllWaiting').addEventListener('click', () => {
        Object.values(liveStudentsData).forEach(s => {
            if(s.status === 'A_AGUARDAR') client.publish(`quizguard/${roomCode}/cmd/${s.id}`, JSON.stringify({ action: 'start_test' }));
        });
    });

    window.tCmd = (id, action) => {
        let payload = { action: action };
        if(action === 'kick' && !confirm("Tem a certeza que deseja expulsar este aluno?")) return;
        if(action === 'unlock_time') {
            let m = prompt("Quantos MINUTOS deseja retirar ao aluno de penalização?");
            if(!m || isNaN(m)) return;
            payload.amount = parseInt(m) * 60;
        }
        client.publish(`quizguard/${roomCode}/cmd/${id}`, JSON.stringify(payload));
    };

    function renderSubmissions() {
        const tbody = document.getElementById('submissionsTable').querySelector('tbody');
        tbody.innerHTML = '';
        submissionsData.slice().reverse().forEach(sub => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${sub.name}</strong><br><small>${sub.status}</small></td>
                <td><strong style="color:var(--primary); font-size:1.1rem;">${sub.score}/20</strong></td>
                <td>${sub.infractions.length} infrações</td>
                <td><button class="btn secondary btn-icon" onclick="alert('Respostas: ${sub.details}\\n\\nInfrações:\\n' + JSON.stringify('${sub.infractions}'))"><i class="fa-solid fa-eye"></i></button></td>`;
            tbody.appendChild(tr);
        });
    }
})();