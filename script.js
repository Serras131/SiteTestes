(() => {
    // 1. GERAÇÃO DOS 3 BANCOS DE 50 PERGUNTAS
    const generateQuestions = (topic, optionsArray) => {
        let qs = [];
        for(let i=0; i<50; i++) {
            qs.push({
                id: i+1,
                text: `${topic} nº ${i+1}: Qual é a resposta correta para esta questão avançada?`,
                options: optionsArray,
                correct: Math.floor(Math.random() * 4) 
            });
        }
        if(topic.includes("Web")) {
            qs[0] = {id: 1, text: "O que significa HTML?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text", "Hyper Tool Language"], correct: 0};
            qs[1] = {id: 2, text: "Em CSS, como se muda a cor do texto?", options: ["text-color", "color", "font-color", "bgcolor"], correct: 1};
            qs[2] = {id: 3, text: "Qual a tag para inserir imagens?", options: ["<picture>", "<image>", "<img>", "<src>"], correct: 2};
        } else if (topic.includes("SQL")) {
            qs[0] = {id: 1, text: "Que comando SQL extrai dados da base de dados?", options: ["EXTRACT", "SELECT", "GET", "OPEN"], correct: 1};
            qs[1] = {id: 2, text: "Como se atualiza dados numa tabela SQL?", options: ["SAVE", "UPDATE", "MODIFY", "CHANGE"], correct: 1};
            qs[2] = {id: 3, text: "Que comando elimina uma tabela inteira e a sua estrutura?", options: ["DROP TABLE", "DELETE TABLE", "REMOVE TABLE", "TRUNCATE"], correct: 0};
        } else {
            qs[0] = {id: 1, text: "Qual destes endereços é de IPv4?", options: ["192.168.1.1", "00:1A:2B:3C", "FE80::1", "127.0.0.G"], correct: 0};
            qs[1] = {id: 2, text: "A camada 3 do Modelo OSI é a camada de:", options: ["Física", "Enlace", "Rede", "Transporte"], correct: 2};
            qs[2] = {id: 3, text: "Qual o porto padrão do protocolo HTTP?", options: ["21", "25", "80", "443"], correct: 2};
        }
        return qs;
    };

    const banks = {
        webdev: generateQuestions("Web Dev", ["HTML", "CSS", "JS", "PHP"]),
        sql: generateQuestions("SQL", ["SELECT", "INSERT", "UPDATE", "DELETE"]),
        networks: generateQuestions("Redes", ["Router", "Switch", "Hub", "Firewall"]),
        empty: []
    };

    function loadCustomThemes() {
        const customThemesGroup = document.getElementById('customThemesGroup');
        customThemesGroup.innerHTML = '';
        let savedBanks = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
        for(let theme in savedBanks) {
            let opt = document.createElement('option');
            opt.value = "custom_" + theme;
            opt.textContent = "⭐ " + theme + ` (${savedBanks[theme].length} Perguntas)`;
            customThemesGroup.appendChild(opt);
        }
    }
    loadCustomThemes(); 

    let currentSessionBank = [];

    // 2. CONEXÃO MQTT (Servidor Público)
    const brokerUrl = 'wss://test.mosquitto.org:8081';
    let client = mqtt.connect(brokerUrl);
    let roomCode = '', myId = '', isTeacher = false;
    let liveStudentsData = {}, submissionsData = [];
    let myTestQuestions = [];

    client.on('connect', () => {
        document.getElementById('connStatus').innerHTML = '<i class="fa-solid fa-check"></i> Ligado ao Servidor.';
        document.getElementById('connStatus').style.color = 'var(--success)';
        document.getElementById('btnStartTest').disabled = false;
    });

    // 3. SEGURANÇA E PROTEÇÃO
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if(e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
            e.preventDefault(); registerSecurityBreach("Inspecionar Código (Atalho Teclado)");
        }
    });

    // 4. MUDANÇA DE VISTAS
    document.getElementById('btnStudentView').addEventListener('click', () => {
        isTeacher = false; document.getElementById('studentView').classList.remove('hidden'); document.getElementById('teacherView').classList.add('hidden'); document.getElementById('btnStudentView').classList.add('active'); document.getElementById('btnTeacherView').classList.remove('active');
    });
    document.getElementById('btnTeacherView').addEventListener('click', () => document.getElementById('teacherAuthModal').classList.remove('hidden'));
    document.getElementById('btnCancelAuth').addEventListener('click', () => document.getElementById('teacherAuthModal').classList.add('hidden'));

    // PROFESSOR: INICIAR SALA E SELECIONAR TEMA
    document.getElementById('btnSubmitAuth').addEventListener('click', () => {
        const pass = document.getElementById('teacherPasswordInput').value;
        const code = document.getElementById('teacherRoomInput').value.trim();
        const selectedTheme = document.getElementById('teacherBankSelect').value;

        if(!code) return alert("Insira um código de sala!");
        if(pass === 'admin') { 
            document.getElementById('teacherAuthModal').classList.add('hidden');
            document.getElementById('teacherView').classList.remove('hidden');
            document.getElementById('studentView').classList.add('hidden');
            document.getElementById('btnTeacherView').classList.add('active');
            document.getElementById('btnStudentView').classList.remove('active');
            
            isTeacher = true; roomCode = code;
            document.getElementById('displayRoomCode').textContent = roomCode;
            
            if(selectedTheme.startsWith("custom_")) {
                let savedBanks = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
                let tName = selectedTheme.replace("custom_", "");
                currentSessionBank = savedBanks[tName] || [];
            } else {
                currentSessionBank = banks[selectedTheme];
            }
            
            client.publish(`quizguard/${roomCode}/questions`, JSON.stringify(currentSessionBank), {retain: true});
            client.subscribe(`quizguard/${roomCode}/std/+`);
            client.subscribe(`quizguard/${roomCode}/sub/+`);
        } else {
            document.getElementById('authError').classList.remove('hidden');
        }
    });

    // 5. GESTÃO DE PERGUNTAS
    document.getElementById('btnManageQuestions').addEventListener('click', () => {
        document.getElementById('qManagerModal').classList.remove('hidden');
        renderQuestionsTable();
    });
    document.getElementById('btnCloseQManager').addEventListener('click', () => {
        document.getElementById('qManagerModal').classList.add('hidden');
        client.publish(`quizguard/${roomCode}/questions`, JSON.stringify(currentSessionBank), {retain: true});
    });

    function renderQuestionsTable() {
        const tbody = document.getElementById('questionsTable').querySelector('tbody');
        tbody.innerHTML = '';
        currentSessionBank.forEach(q => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${q.id}</td><td>${q.text}</td>
                <td>
                    <button class="btn warning btn-icon" onclick="window.editQ(${q.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn danger btn-icon" onclick="window.deleteQ(${q.id})"><i class="fa-solid fa-trash"></i></button>
                </td>`;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('btnSaveQuestion').addEventListener('click', () => {
        const id = document.getElementById('editQId').value;
        const text = document.getElementById('editQText').value;
        const o0 = document.getElementById('editOpt0').value; const o1 = document.getElementById('editOpt1').value; const o2 = document.getElementById('editOpt2').value; const o3 = document.getElementById('editOpt3').value;
        const correct = parseInt(document.getElementById('editQCorrect').value);

        if(!text || !o0 || !o1 || !o2 || !o3) return alert("Preencha todas as opções.");

        if(id) { 
            let q = currentSessionBank.find(x => x.id == id);
            q.text = text; q.options = [o0,o1,o2,o3]; q.correct = correct;
        } else {
            let newId = currentSessionBank.length > 0 ? Math.max(...currentSessionBank.map(b=>b.id)) + 1 : 1;
            currentSessionBank.push({id: newId, text, options: [o0,o1,o2,o3], correct});
        }
        renderQuestionsTable();
        document.querySelectorAll('#qManagerModal input[type="text"], #qManagerModal input[type="hidden"]').forEach(el => el.value = '');
    });

    document.getElementById('btnSaveCustomBank').addEventListener('click', () => {
        let themeName = prompt("Qual o nome deste Tema para o guardar?");
        if(!themeName || themeName.trim() === "") return;
        let savedBanks = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
        savedBanks[themeName] = [...currentSessionBank];
        localStorage.setItem('qg_custom_banks', JSON.stringify(savedBanks));
        alert("Tema guardado com sucesso! Estará disponível no menu ao criar novas salas.");
        loadCustomThemes(); 
    });

    window.editQ = (id) => {
        const q = currentSessionBank.find(x => x.id == id);
        document.getElementById('editQId').value = q.id; document.getElementById('editQText').value = q.text;
        document.getElementById('editOpt0').value = q.options[0]; document.getElementById('editOpt1').value = q.options[1];
        document.getElementById('editOpt2').value = q.options[2]; document.getElementById('editOpt3').value = q.options[3];
        document.getElementById('editQCorrect').value = q.correct;
    };
    window.deleteQ = (id) => {
        if(!confirm("Eliminar pergunta?")) return;
        currentSessionBank = currentSessionBank.filter(x => x.id != id); renderQuestionsTable();
    };

    // 6. COMUNICAÇÃO MQTT E ESTADO DO ALUNO
    let downloadedBank = null;
    client.on('message', (topic, payload) => {
        const msgStr = payload.toString(); const parts = topic.split('/');

        if(parts[2] === 'questions' && !isTeacher) downloadedBank = JSON.parse(msgStr);
        if(parts[2] === 'cmd' && parts[3] === myId && !isTeacher) {
            const cmd = JSON.parse(msgStr);
            if(cmd.action === 'start_test') { 
                document.getElementById('studentWaitModal').classList.add('hidden');
                isTestBlocked = false; 
                publishStudentState('EM_TESTE'); 
                startTimer();
                setTimeout(() => { focusCheckActive = true; }, 1500); 
            } else if(cmd.action === 'unlock') {
                isTestBlocked = false; document.getElementById('studentLockModal').classList.add('hidden');
                publishStudentState(); try { document.documentElement.requestFullscreen(); } catch(e){}
            } else if(cmd.action === 'unlock_time') {
                isTestBlocked = false; document.getElementById('studentLockModal').classList.add('hidden');
                timeRemainingSeconds -= cmd.amount; 
                publishStudentState(); try { document.documentElement.requestFullscreen(); } catch(e){}
            } else if(cmd.action === 'force_pause') {
                // Nova ação: Pausa manual pelo professor
                isTestBlocked = true;
                publishStudentState('BLOQUEADO');
                document.getElementById('lockReasonText').textContent = "Pausado pelo Professor para Verificação";
                document.getElementById('studentLockModal').classList.remove('hidden');
            } else if(cmd.action === 'terminate') {
                finalizeTest("Submetido Forçadamente pelo Professor devido a Quebra de Regras");
            } else if(cmd.action === 'kick') { 
                focusCheckActive = false;
                clearInterval(timerInterval);
                document.getElementById('studentQuizCard').classList.add('hidden');
                document.getElementById('studentLockModal').classList.add('hidden');
                document.getElementById('studentWaitModal').classList.add('hidden');
                document.getElementById('studentKickedModal').classList.remove('hidden');
                try { document.exitFullscreen(); } catch(e){}
                client.publish(`quizguard/${roomCode}/std/${myId}`, '', { retain: true }); 
            }
        }
        if(parts[2] === 'std' && isTeacher) {
            if(!msgStr) delete liveStudentsData[parts[3]]; else liveStudentsData[parts[3]] = JSON.parse(msgStr);
            renderTeacherLiveTable();
        }
        if(parts[2] === 'sub' && isTeacher) { submissionsData.push(JSON.parse(msgStr)); renderTeacherSubsTable(); }
    });

    // 7. INICIAR SALA DE ESPERA DO ALUNO
    let timeRemainingSeconds = 0, timerInterval = null, focusCheckActive = false, isTestBlocked = false, currentQIndex = 0, studentAnswers = [], myInfractions = [];

    document.getElementById('btnStartTest').addEventListener('click', async () => {
        roomCode = document.getElementById('studentRoomCode').value.trim();
        const name = document.getElementById('studentName').value.trim();
        if(!roomCode || !name) return alert('Preencha a Sala e o Nome.');

        client.subscribe(`quizguard/${roomCode}/questions`);
        document.getElementById('btnStartTest').innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> A entrar...";
        
        setTimeout(async () => {
            if(!downloadedBank || downloadedBank.length === 0) {
                alert("A sala não existe ou o professor ainda não preparou as perguntas.");
                document.getElementById('btnStartTest').innerHTML = "<i class='fa-solid fa-rocket'></i> Entrar na Sala (F11)";
                return;
            }

            let maxPerguntas = downloadedBank.length >= 30 ? 30 : downloadedBank.length;
            myTestQuestions = downloadedBank.sort(() => 0.5 - Math.random()).slice(0, maxPerguntas);
            studentAnswers = new Array(maxPerguntas).fill(null);
            document.getElementById('totalQNum').textContent = maxPerguntas;

            try { const elem = document.documentElement; if(elem.requestFullscreen) await elem.requestFullscreen(); else if(elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen(); } catch (err) { return alert("Pressione F11 para permitir o Ecrã Inteiro."); }

            myId = 'STD_' + Date.now();
            document.getElementById('displayStudentName').textContent = name;
            client.subscribe(`quizguard/${roomCode}/cmd/${myId}`);
            
            timeRemainingSeconds = (document.getElementById('settingDuration').value || 30) * 60; 
            document.getElementById('studentRegCard').classList.add('hidden');
            document.getElementById('studentQuizCard').classList.remove('hidden');
            
            isTestBlocked = true;
            document.getElementById('studentWaitModal').classList.remove('hidden');
            publishStudentState('A_AGUARDAR'); 
            loadQuestion(0);

        }, 1500);
    });

    function publishStudentState(statusOverride) {
        if(!roomCode || !myId) return;
        client.publish(`quizguard/${roomCode}/std/${myId}`, JSON.stringify({ id: myId, name: document.getElementById('studentName').value, status: statusOverride || (isTestBlocked ? 'BLOQUEADO' : 'EM_TESTE'), currentQ: currentQIndex + 1, infractions: myInfractions }), { retain: true });
    }

    // BATOTAS
    window.addEventListener('blur', () => { if(focusCheckActive && !isTestBlocked) registerSecurityBreach("Perda de Foco (Alt-Tab / Mudou de Aba / Clique fora)"); });
    document.addEventListener('visibilitychange', () => { if(document.hidden && focusCheckActive && !isTestBlocked) registerSecurityBreach("Minimizou o Navegador"); });
    document.addEventListener('fullscreenchange', () => { if(!document.fullscreenElement && focusCheckActive && !isTestBlocked) registerSecurityBreach("Saiu do Ecrã Inteiro"); });

    function registerSecurityBreach(reason) {
        if(!focusCheckActive) return; isTestBlocked = true;
        myInfractions.push({ time: new Date().toLocaleTimeString(), reason: reason });
        publishStudentState('BLOQUEADO');
        document.getElementById('lockReasonText').textContent = "Motivo exato: " + reason;
        document.getElementById('studentLockModal').classList.remove('hidden');
    }

    // QUIZ LOGIC
    document.getElementById('btnNextQ').addEventListener('click', () => { saveCurrentAnswer(); if(currentQIndex < myTestQuestions.length - 1) loadQuestion(currentQIndex + 1); publishStudentState(); });
    document.getElementById('btnPrevQ').addEventListener('click', () => { saveCurrentAnswer(); if(currentQIndex > 0) loadQuestion(currentQIndex - 1); publishStudentState(); });

    function loadQuestion(index) {
        currentQIndex = index; const q = myTestQuestions[index];
        document.getElementById('currentQNum').textContent = index + 1;
        document.getElementById('quizProgressBar').style.width = `${((index + 1) / myTestQuestions.length) * 100}%`;
        
        let html = `<h3 class="question-title">${index + 1}. ${q.text}</h3><div class="options-list">`;
        q.options.forEach((opt, i) => {
            const isChecked = studentAnswers[index] === i ? 'checked' : '';
            html += `<label class="option-label ${isChecked ? 'selected' : ''}"><input type="radio" name="qopt" value="${i}" ${isChecked}> ${opt}</label>`;
        });
        html += `</div>`;
        document.getElementById('singleQuestionContainer').innerHTML = html;
        document.querySelectorAll('input[name="qopt"]').forEach(r => {
            r.addEventListener('change', (e) => {
                document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
                e.target.closest('.option-label').classList.add('selected');
            });
        });
        document.getElementById('btnPrevQ').disabled = index === 0;
        if(index === myTestQuestions.length - 1) { document.getElementById('btnNextQ').classList.add('hidden'); document.getElementById('btnSubmitTest').classList.remove('hidden'); } 
        else { document.getElementById('btnNextQ').classList.remove('hidden'); document.getElementById('btnSubmitTest').classList.add('hidden'); }
    }

    function saveCurrentAnswer() { const selected = document.querySelector('input[name="qopt"]:checked'); studentAnswers[currentQIndex] = selected ? parseInt(selected.value) : null; }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (isTestBlocked) return;
            timeRemainingSeconds--;
            if (timeRemainingSeconds <= 0) finalizeTest("Tempo Esgotado");
            else {
                const m = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0');
                const s = (timeRemainingSeconds % 60).toString().padStart(2, '0');
                document.getElementById('timeLeft').textContent = `${m}:${s}`;
            }
        }, 1000);
    }

    document.getElementById('btnSubmitTest').addEventListener('click', () => { saveCurrentAnswer(); if(confirm("Deseja entregar a prova?")) finalizeTest("Submissão Voluntária"); });

    function finalizeTest(reasonOverride = null) {
        focusCheckActive = false; clearInterval(timerInterval);
        
        const valPerQuestion = 20 / myTestQuestions.length; const penalty = valPerQuestion / 4;
        let correct = 0, wrong = 0, blank = 0;

        studentAnswers.forEach((ans, idx) => {
            if(ans === null) blank++;
            else if(ans === myTestQuestions[idx].correct) correct++;
            else wrong++;
        });

        let finalScore = Math.max(0, (correct * valPerQuestion) - (wrong * penalty)).toFixed(2);

        client.publish(`quizguard/${roomCode}/sub/${myId}`, JSON.stringify({ id: myId, name: document.getElementById('studentName').value, score: finalScore, details: `${correct} Certas, ${wrong} Erradas, ${blank} Branco`, infractions: myInfractions, status: reasonOverride || "Concluído" }));
        client.publish(`quizguard/${roomCode}/std/${myId}`, '', { retain: true }); 
        
        try { document.exitFullscreen(); } catch(e){}
        document.getElementById('studentQuizCard').classList.add('hidden'); document.getElementById('studentLockModal').classList.add('hidden');
        document.getElementById('studentWaitModal').classList.add('hidden');
        document.getElementById('studentResultCard').classList.remove('hidden');
        document.getElementById('finalScoreVal').textContent = `${finalScore}`;
        document.getElementById('scoreDetailsText').textContent = `${correct} Certas | ${wrong} Erradas | ${blank} Branco`;
        if (reasonOverride) document.getElementById('resultTitle').textContent = reasonOverride;
    }

    // 9. PROFESSOR - TABELAS E ACÕES
    function renderTeacherLiveTable() {
        const tbody = document.getElementById('liveStudentsTable').querySelector('tbody');
        tbody.innerHTML = ''; const students = Object.values(liveStudentsData);
        if(students.length === 0) { tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Nenhum aluno ativo.</td></tr>`; return; }

        students.forEach(s => {
            const isBlocked = s.status === 'BLOQUEADO'; 
            const isWaiting = s.status === 'A_AGUARDAR';
            const tr = document.createElement('tr');
            
            if (isBlocked) tr.className = 'blocked-row';
            else if (isWaiting) tr.className = 'waiting-row';
            
            let statusHTML = `<span class="live-badge">Tudo Ok</span>`;
            if (isBlocked) statusHTML = `<span class="live-badge" style="background:var(--danger)">Bloqueado (${s.infractions.length}x)</span><br><small style="color:var(--danger); font-weight:bold;">${s.infractions[s.infractions.length-1].reason}</small>`;
            if (isWaiting) statusHTML = `<span class="live-badge" style="background:var(--info)">Na Sala de Espera</span>`;

            let actionsHTML = `-`;
            if (isWaiting) {
                actionsHTML = `<button class="btn info btn-icon" title="Autorizar Inicio" onclick="window.teacherAction('${s.id}', 'start_test')"><i class="fa-solid fa-play"></i> Autorizar</button>
                               <button class="btn danger btn-icon" title="Expulsar" onclick="window.teacherAction('${s.id}', 'kick')"><i class="fa-solid fa-door-open"></i> Expulsar</button>`;
            } else if (isBlocked) {
                actionsHTML = `
                    <div class="action-group">
                        <button class="btn success btn-icon" title="Libertar Normal" onclick="window.teacherAction('${s.id}', 'unlock')"><i class="fa-solid fa-play"></i></button>
                        <button class="btn warning btn-icon" title="Libertar e Retirar Tempo" onclick="window.teacherAction('${s.id}', 'unlock_time')"><i class="fa-solid fa-clock-rotate-left"></i> Tempo</button>
                        <button class="btn danger btn-icon" title="Terminar Teste Agora" onclick="window.teacherAction('${s.id}', 'terminate')"><i class="fa-solid fa-skull"></i> Terminar</button>
                    </div>`;
            } else {
                // ALUNO NORMAL (Sem infrações): Botão para Pausar manualmente ou Expulsar
                actionsHTML = `
                    <div class="action-group">
                        <button class="btn warning btn-icon" title="Pausar Teste para Investigação" onclick="window.teacherAction('${s.id}', 'force_pause')"><i class="fa-solid fa-hand"></i> Pausar</button>
                        <button class="btn danger btn-icon" title="Expulsar (Sem Submeter)" onclick="window.teacherAction('${s.id}', 'kick')"><i class="fa-solid fa-door-open"></i> Expulsar</button>
                    </div>`;
            }

            tr.innerHTML = `
                <td><strong>${s.name}</strong></td>
                <td><div style="font-weight:bold; color:var(--primary);">P. ${s.currentQ} / 30</div></td>
                <td>${statusHTML}</td>
                <td><div class="action-group">${actionsHTML}</div></td>`;
            tbody.appendChild(tr);
        });
    }

    // AÇÃO GLOBAL: INICIAR TODOS OS QUE ESTÃO A AGUARDAR
    document.getElementById('btnStartAllWaiting').addEventListener('click', () => {
        Object.values(liveStudentsData).forEach(s => {
            if (s.status === 'A_AGUARDAR') {
                client.publish(`quizguard/${roomCode}/cmd/${s.id}`, JSON.stringify({ action: 'start_test' }));
            }
        });
    });

    function renderTeacherSubsTable() {
        const tbody = document.getElementById('submissionsTable').querySelector('tbody');
        tbody.innerHTML = '';
        if(submissionsData.length === 0) { tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Sem submissões.</td></tr>`; return; }
        submissionsData.slice().reverse().forEach(s => {
            const hasInfr = s.infractions.length > 0; const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.name}</strong><br><small>${s.status}</small></td>
                <td><strong style="font-size:1.2rem; color:var(--primary);">${s.score} / 20</strong></td>
                <td>${hasInfr ? `<span style="color:var(--danger); font-weight:bold;">${s.infractions.length} Quebra(s)</span>` : `<span style="color:var(--success);">0</span>`}</td>
                <td><button class="btn secondary btn-icon" onclick="window.viewInfractions('${s.id}')"><i class="fa-solid fa-eye"></i> Analisar</button></td>`;
            tbody.appendChild(tr);
        });
    }

    window.teacherAction = (studentId, actionType) => {
        let payload;
        if(actionType === 'terminate') {
            if(!confirm("Isto vai fechar o teste e submeter a nota. Tem a certeza?")) return;
            payload = { action: 'terminate' };
        } else if(actionType === 'kick') {
            if(!confirm("Tem a certeza que deseja expulsar o aluno sem submeter qualquer nota?")) return;
            payload = { action: 'kick' };
        } else if(actionType === 'unlock_time') {
            let mins = prompt("Quantos MINUTOS deseja retirar ao aluno devido à infração?");
            if(mins === null || mins.trim() === "" || isNaN(mins)) return; 
            payload = { action: 'unlock_time', amount: parseInt(mins) * 60 };
        } else if(actionType === 'force_pause') {
            payload = { action: 'force_pause' };
        } else {
            payload = { action: actionType };
        }

        client.publish(`quizguard/${roomCode}/cmd/${studentId}`, JSON.stringify(payload));
        
        // Remove estado provisório na tabela
        if(liveStudentsData[studentId] && ['unlock','unlock_time','start_test'].includes(actionType)) { 
            liveStudentsData[studentId].status = 'EM_TESTE'; renderTeacherLiveTable(); 
        }
    };

    window.viewInfractions = (studentId) => {
        const sub = submissionsData.find(x => x.id === studentId); if(!sub) return;
        let msg = `Término: ${sub.status}\nRespostas: ${sub.details}\n\nHistórico de Batotas:\n`;
        if(sub.infractions.length === 0) msg += "✅ Nenhuma. Comportamento exemplar.";
        else sub.infractions.forEach(inf => msg += `❌ [${inf.time}] ${inf.reason}\n`);
        alert(msg);
    };
})();