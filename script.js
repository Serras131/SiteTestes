// ==========================================
// MÓDULO DE SEGURANÇA E COMUNICAÇÃO GLOBAL
// ==========================================
(() => {
    // 1. LIGAÇÃO AO SERVIDOR PÚBLICO MQTT (Permite sincronização sem Backend próprio)
    const brokerUrl = 'wss://test.mosquitto.org:8081';
    let client;
    try {
        client = mqtt.connect(brokerUrl);
    } catch(e) {
        console.error("Erro MQTT", e);
    }

    let isConnected = false;
    let roomCode = '';
    let myId = '';
    let isTeacher = false;
    let liveStudentsData = {};
    let submissionsData = [];

    client.on('connect', () => {
        isConnected = true;
        const statusEl = document.getElementById('connStatus');
        if(statusEl) {
            statusEl.innerHTML = '<i class="fa-solid fa-check"></i> Ligado ao Servidor. Pronto.';
            statusEl.style.color = 'var(--success)';
        }
        document.getElementById('btnStartTest').disabled = false;
    });

    // 2. PROTEÇÃO ANTI-CHEAT E BLOQUEIO DE CONSOLA
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
            e.preventDefault(); registerSecurityBreach("Tentou forçar atalhos de desenvolvedor");
        }
    });

    setInterval(() => {
        const start = performance.now();
        debugger; 
        if (performance.now() - start > 100) registerSecurityBreach("Consola Aberta / Manipulação de Código");
    }, 2000);

    // 3. VARIÁVEIS E GERAÇÃO DE PERGUNTAS (30 Perguntas)
    const questions = Array.from({length: 30}, (_, i) => ({
        id: i + 1, text: `Pergunta oficial nº ${i + 1} para avaliação da matéria.`,
        options: ["Resposta A", "Resposta B (Correta)", "Resposta C", "Resposta D"],
        correct: 1 
    }));

    let timeRemainingSeconds = 0;
    let timerInterval = null;
    let focusCheckActive = false;
    let isTestBlocked = false;
    let studentAnswers = new Array(30).fill(null);
    let currentQIndex = 0;
    let myInfractions = [];

    // 4. MUDANÇA DE ECRÃS E LOGIN
    document.getElementById('btnStudentView').addEventListener('click', () => {
        isTeacher = false;
        document.getElementById('studentView').classList.remove('hidden');
        document.getElementById('teacherView').classList.add('hidden');
        document.getElementById('btnStudentView').classList.add('active');
        document.getElementById('btnTeacherView').classList.remove('active');
    });

    document.getElementById('btnTeacherView').addEventListener('click', () => {
        document.getElementById('teacherPasswordInput').value = '';
        document.getElementById('teacherRoomInput').value = '';
        document.getElementById('teacherAuthModal').classList.remove('hidden');
    });

    document.getElementById('btnCancelAuth').addEventListener('click', () => {
        document.getElementById('teacherAuthModal').classList.add('hidden');
    });

    document.getElementById('btnSubmitAuth').addEventListener('click', () => {
        const pass = document.getElementById('teacherPasswordInput').value;
        const code = document.getElementById('teacherRoomInput').value.trim();
        
        if (!code) return alert("Insira um código de sala!");
        if (pass === 'prof123') { // Senha fixa para segurança
            document.getElementById('teacherAuthModal').classList.add('hidden');
            document.getElementById('teacherView').classList.remove('hidden');
            document.getElementById('studentView').classList.add('hidden');
            document.getElementById('btnTeacherView').classList.add('active');
            document.getElementById('btnStudentView').classList.remove('active');
            
            isTeacher = true;
            roomCode = code;
            document.getElementById('displayRoomCode').textContent = roomCode;
            
            // Ouve tudo o que acontece nesta sala
            client.subscribe(`quizguard/${roomCode}/std/+`);
            client.subscribe(`quizguard/${roomCode}/sub/+`);
        } else {
            document.getElementById('authError').classList.remove('hidden');
        }
    });

    // 5. RECEÇÃO DE MENSAGENS DO SERVIDOR GLOBAL
    client.on('message', (topic, payload) => {
        const msgStr = payload.toString();
        const parts = topic.split('/');
        // parts = ["quizguard", "1234", "tipo", "id"]

        // Aluno recebe ordem de desbloqueio do professor
        if (topic.includes('/cmd/') && !isTeacher) {
            const cmd = JSON.parse(msgStr);
            if (cmd.action === 'unlock') {
                isTestBlocked = false;
                document.getElementById('studentLockModal').classList.add('hidden');
                publishStudentState(); // Avisa o professor que já está a fazer o teste de novo
                try { document.documentElement.requestFullscreen(); } catch(e){}
            }
        }

        // Professor recebe atualizações dos alunos
        if (topic.includes('/std/') && isTeacher) {
            const sid = parts[3];
            if (!msgStr) delete liveStudentsData[sid]; // Se o aluno submeter, sai da lista
            else liveStudentsData[sid] = JSON.parse(msgStr);
            renderTeacherLiveTable();
        }

        // Professor recebe notas finais
        if (topic.includes('/sub/') && isTeacher) {
            submissionsData.push(JSON.parse(msgStr));
            renderTeacherSubsTable();
        }
    });

    // 6. INÍCIO DO TESTE PELO ALUNO
    document.getElementById('btnStartTest').addEventListener('click', async () => {
        roomCode = document.getElementById('studentRoomCode').value.trim();
        const name = document.getElementById('studentName').value.trim();
        if (!roomCode || !name) return alert('Preencha a Sala e o Nome.');

        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) await elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
        } catch (err) {
            alert("Toque OK e inicie novamente para forçar o ecrã inteiro no telemóvel.");
            return;
        }

        myId = 'STD_' + Date.now();
        document.getElementById('displayStudentName').textContent = name;
        
        client.subscribe(`quizguard/${roomCode}/cmd/${myId}`); // Fica à escuta do professor
        publishStudentState('EM_TESTE');

        timeRemainingSeconds = 30 * 60; // 30 mins
        document.getElementById('studentRegCard').classList.add('hidden');
        document.getElementById('studentQuizCard').classList.remove('hidden');
        
        loadQuestion(0);
        startTimer();
        setTimeout(() => { focusCheckActive = true; }, 1000);
    });

    function publishStudentState(statusOverride) {
        if (!roomCode || !myId) return;
        const state = {
            id: myId,
            name: document.getElementById('studentName').value,
            status: statusOverride || (isTestBlocked ? 'BLOQUEADO' : 'EM_TESTE'),
            currentQ: currentQIndex + 1,
            infractions: myInfractions
        };
        // Manda o estado para a rede com "retain" para o professor ver mesmo se entrar depois
        client.publish(`quizguard/${roomCode}/std/${myId}`, JSON.stringify(state), { retain: true });
    }

    // 7. SISTEMA ANTI-CHEAT (Aviso Automático ao Professor)
    window.addEventListener('blur', () => {
        if (focusCheckActive && !isTestBlocked) registerSecurityBreach("Mudou de Aba / Saiu da Aplicação");
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && focusCheckActive && !isTestBlocked) registerSecurityBreach("Minimizou o Navegador no Telemóvel");
    });
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && focusCheckActive && !isTestBlocked) registerSecurityBreach("Saiu do F11 (Ecrã Inteiro)");
    });

    function registerSecurityBreach(reason) {
        if (!focusCheckActive) return;
        isTestBlocked = true;
        
        const timeNow = new Date().toLocaleTimeString();
        myInfractions.push({ time: timeNow, reason: reason });
        
        publishStudentState('BLOQUEADO'); // Dispara aviso pro servidor

        document.getElementById('lockReasonText').textContent = "Motivo: " + reason;
        document.getElementById('studentLockModal').classList.remove('hidden');
    }

    // 8. FUNCIONAMENTO DO QUIZ
    document.getElementById('btnNextQ').addEventListener('click', () => {
        saveCurrentAnswer();
        if (currentQIndex < 29) loadQuestion(currentQIndex + 1);
        publishStudentState();
    });
    
    document.getElementById('btnPrevQ').addEventListener('click', () => {
        saveCurrentAnswer();
        if (currentQIndex > 0) loadQuestion(currentQIndex - 1);
        publishStudentState();
    });

    function loadQuestion(index) {
        currentQIndex = index;
        const q = questions[index];
        document.getElementById('currentQNum').textContent = index + 1;
        document.getElementById('quizProgressBar').style.width = `${((index + 1) / 30) * 100}%`;
        
        let html = `<h3 class="question-title">${q.id}. ${q.text}</h3><div class="options-list">`;
        q.options.forEach((opt, i) => {
            const isChecked = studentAnswers[index] === i ? 'checked' : '';
            html += `<label class="option-label ${isChecked ? 'selected' : ''}">
                <input type="radio" name="qopt" value="${i}" ${isChecked}> ${opt}
            </label>`;
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
        
        if (index === 29) {
            document.getElementById('btnNextQ').classList.add('hidden');
            document.getElementById('btnSubmitTest').classList.remove('hidden');
        } else {
            document.getElementById('btnNextQ').classList.remove('hidden');
            document.getElementById('btnSubmitTest').classList.add('hidden');
        }
    }

    function saveCurrentAnswer() {
        const selected = document.querySelector('input[name="qopt"]:checked');
        studentAnswers[currentQIndex] = selected ? parseInt(selected.value) : null;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (isTestBlocked) return;
            timeRemainingSeconds--;
            const m = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0');
            const s = (timeRemainingSeconds % 60).toString().padStart(2, '0');
            document.getElementById('timeLeft').textContent = `${m}:${s}`;
            if (timeRemainingSeconds <= 0) finalizeTest();
        }, 1000);
    }

    // 9. CÁLCULO DA NOTA E SUBMISSÃO
    document.getElementById('btnSubmitTest').addEventListener('click', () => {
        saveCurrentAnswer();
        if(confirm("Deseja finalizar e entregar a prova?")) finalizeTest();
    });

    function finalizeTest() {
        focusCheckActive = false;
        clearInterval(timerInterval);
        
        // Regra: 30 perguntas = 20 valores (cada pergunta = ~0.66). Erro desconta 1/4 (0.16)
        const valPerQuestion = 20 / 30;
        const penalty = valPerQuestion / 4;

        let correct = 0, wrong = 0, blank = 0;

        studentAnswers.forEach((ans, idx) => {
            if (ans === null) blank++;
            else if (ans === questions[idx].correct) correct++;
            else wrong++;
        });

        let finalScore = (correct * valPerQuestion) - (wrong * penalty);
        finalScore = Math.max(0, finalScore).toFixed(2);

        // Envia o resultado para o professor
        const subRecord = {
            id: myId,
            name: document.getElementById('studentName').value,
            score: finalScore,
            details: `${correct} Certas, ${wrong} Erradas, ${blank} Em Branco`,
            infractions: myInfractions
        };
        client.publish(`quizguard/${roomCode}/sub/${myId}`, JSON.stringify(subRecord));
        
        // Remove-se da lista de ativos do professor
        client.publish(`quizguard/${roomCode}/std/${myId}`, '', { retain: true });

        try { document.exitFullscreen(); } catch(e){}
        document.getElementById('studentQuizCard').classList.add('hidden');
        document.getElementById('studentLockModal').classList.add('hidden');
        document.getElementById('studentResultCard').classList.remove('hidden');
        document.getElementById('finalScoreVal').textContent = `${finalScore}`;
        document.getElementById('scoreDetailsText').textContent = `${correct} Certas | ${wrong} Erradas | ${blank} Em Branco`;
    }

    // 10. ATUALIZAÇÃO DO ECRÃ DO PROFESSOR (em Tempo Real)
    function renderTeacherLiveTable() {
        const tbody = document.getElementById('liveStudentsTable').querySelector('tbody');
        tbody.innerHTML = '';
        
        const students = Object.values(liveStudentsData);
        if (students.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Nenhum aluno na sala.</td></tr>`;
            return;
        }

        students.forEach(s => {
            const isBlocked = s.status === 'BLOQUEADO';
            const tr = document.createElement('tr');
            if (isBlocked) tr.className = 'blocked-row';
            
            tr.innerHTML = `
                <td><strong>${s.name}</strong></td>
                <td><div style="font-weight:bold; color:var(--primary);">P. ${s.currentQ} / 30</div></td>
                <td>
                    ${isBlocked 
                        ? `<span class="live-badge" style="background:var(--danger)">Bloqueado (${s.infractions.length} faltas)</span><br><small style="color:var(--danger)">Última: ${s.infractions[s.infractions.length-1].reason}</small>`
                        : `<span class="live-badge">Focado</span>`
                    }
                </td>
                <td>
                    ${isBlocked ? `<button class="btn warning" onclick="window.unlockStudent('${s.id}')"><i class="fa-solid fa-key"></i> Libertar Foco</button>` : '-'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderTeacherSubsTable() {
        const tbody = document.getElementById('submissionsTable').querySelector('tbody');
        tbody.innerHTML = '';
        if (submissionsData.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Sem submissões ainda.</td></tr>`;
            return;
        }

        submissionsData.forEach(s => {
            const hasInfr = s.infractions.length > 0;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.name}</strong></td>
                <td><strong style="font-size:1.1rem; color:var(--primary);">${s.score} / 20</strong></td>
                <td>${hasInfr ? `<span style="color:var(--danger); font-weight:bold;">${s.infractions.length} Falta(s)</span>` : `<span style="color:var(--success);">0 Faltas</span>`}</td>
                <td><button class="btn secondary" onclick="window.viewInfractions('${s.id}')">Analisar</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Funções Globais expostas apenas para os Botões gerados na Tabela do Professor
    window.unlockStudent = (studentId) => {
        // Envia um comando secreto ao telemóvel do aluno para o libertar
        client.publish(`quizguard/${roomCode}/cmd/${studentId}`, JSON.stringify({ action: 'unlock' }));
        
        // Remove temporariamente o estado bloqueado da tabela até o aluno responder
        if(liveStudentsData[studentId]) {
            liveStudentsData[studentId].status = 'EM_TESTE';
            renderTeacherLiveTable();
        }
    };

    window.viewInfractions = (studentId) => {
        const sub = submissionsData.find(x => x.id === studentId);
        if (!sub) return;
        let msg = `Resumo de Respostas:\n${sub.details}\n\nHistórico de Segurança:\n`;
        if (sub.infractions.length === 0) msg += "✅ Nenhuma infração cometida. O aluno não saiu do ecrã.";
        else sub.infractions.forEach(inf => msg += `❌ [${inf.time}] ${inf.reason}\n`);
        alert(msg);
    };

})();