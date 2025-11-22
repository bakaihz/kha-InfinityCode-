(function() {
    if (document.getElementById("eclipse-panel")) return;
    
    const features = {
        autoAnswer: false,
        revealAnswers: false,
        questionSpoof: false,
        videoSpoof: false,
        darkMode: true,
        rgbLogo: false
    };

    const config = {
        autoAnswerDelay: 1.5
    };

    function showToast(message, type = "info", duration = 3000) {
        const toast = document.createElement("div");
        toast.className = `eclipse-toast eclipse-toast-${type}`;
        toast.innerHTML = `
            <div class="eclipse-toast-icon">${type === "success" ? "✓" : type === "error" ? "✗" : "•"}</div>
            <div class="eclipse-toast-message">${message}</div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const style = document.createElement("style");
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        :root {
            --eclipse-bg: #0a0a0f;
            --eclipse-surface: #151520;
            --eclipse-border: #2a2a3a;
            --eclipse-primary: #ff2a6d;
            --eclipse-primary-light: #ff5a8d;
            --eclipse-accent: #05d9e8;
            --eclipse-accent-light: #65f2ff;
            --eclipse-text: #ffffff;
            --eclipse-text-muted: #b8b8d6;
            --eclipse-success: #00ff88;
            --eclipse-error: #ff2a6d;
            --eclipse-warning: #ffcc00;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 42, 109, 0.4); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(255, 42, 109, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 42, 109, 0); }
        }
        
        @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            }
            0% { transform: translateY(0) scale(1); }
            20% { transform: translateY(-15px) scale(1.05); }
            53% { transform: translateY(-7px) scale(1.02); }
            80% { transform: translateY(0) scale(1.01); }
            100% { transform: translateY(0) scale(1); }
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
        }
        
        @keyframes matrixRain {
            0% { transform: translateY(-100%); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        @keyframes hueRotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 10px var(--eclipse-accent), 0 0 20px var(--eclipse-accent), 0 0 30px var(--eclipse-accent); }
            50% { text-shadow: 0 0 5px var(--eclipse-primary), 0 0 10px var(--eclipse-primary), 0 0 15px var(--eclipse-primary); }
        }
        
        .eclipse-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #050510 0%, #0a0a1a 25%, #151525 50%, #0a0a1a 75%, #050510 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            color: white;
            font-family: 'Inter', sans-serif;
            transition: opacity 0.5s;
            overflow: hidden;
        }
        
        .eclipse-splash::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 30%, rgba(255, 42, 109, 0.15) 0%, transparent 30%),
                radial-gradient(circle at 80% 70%, rgba(5, 217, 232, 0.1) 0%, transparent 30%),
                radial-gradient(circle at 40% 80%, rgba(0, 255, 136, 0.05) 0%, transparent 30%);
            z-index: 0;
            animation: hueRotate 20s linear infinite;
        }
        
        .eclipse-splash::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(90deg, transparent 24px, transparent 25px),
                linear-gradient(180deg, transparent 24px, transparent 25px);
            background-size: 25px 25px;
            background-position: 0 0;
            opacity: 0.1;
            z-index: 1;
        }
        
        .matrix-rain {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .matrix-column {
            position: absolute;
            top: -100%;
            width: 20px;
            font-family: 'Courier New', monospace;
            font-size: 18px;
            color: var(--eclipse-accent);
            text-shadow: 0 0 8px currentColor;
            animation: matrixRain 3s linear infinite;
            animation-delay: calc(var(--delay) * 1s);
            opacity: var(--opacity);
        }
        
        .eclipse-splash-content {
            position: relative;
            z-index: 2;
            text-align: center;
            animation: fadeIn 1s ease-out;
        }
        
        .eclipse-splash-title {
            font-size: 52px;
            font-weight: 800;
            margin-bottom: 16px;
            background: linear-gradient(45deg, var(--eclipse-primary), var(--eclipse-accent), var(--eclipse-success));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            animation: textGlow 3s ease-in-out infinite;
            letter-spacing: 2px;
            text-transform: uppercase;
            position: relative;
        }
        
        .eclipse-splash-title::after {
            content: "PLATFORM DESTROYER";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--eclipse-primary), var(--eclipse-accent), var(--eclipse-success));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            animation: glitch 0.5s infinite;
            opacity: 0.7;
        }
        
        .eclipse-splash-subtitle {
            font-size: 20px;
            color: var(--eclipse-text-muted);
            margin-bottom: 40px;
            font-weight: 400;
            letter-spacing: 1px;
        }
        
        .eclipse-splash-loader {
            width: 80px;
            height: 80px;
            position: relative;
            margin: 0 auto 30px;
        }
        
        .eclipse-splash-loader-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-top-color: var(--eclipse-primary);
            border-radius: 50%;
            animation: orbit 2s linear infinite;
            box-shadow: 0 0 15px var(--eclipse-primary);
        }
        
        .eclipse-splash-loader-ring:nth-child(2) {
            border-top-color: var(--eclipse-accent);
            animation-duration: 3s;
            transform: rotate(60deg);
            box-shadow: 0 0 15px var(--eclipse-accent);
        }
        
        .eclipse-splash-loader-ring:nth-child(3) {
            border-top-color: var(--eclipse-success);
            animation-duration: 4s;
            transform: rotate(120deg);
            box-shadow: 0 0 15px var(--eclipse-success);
        }
        
        .eclipse-splash-loader-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, var(--eclipse-primary), var(--eclipse-accent));
            border-radius: 50%;
            box-shadow: 0 0 20px var(--eclipse-primary);
            animation: pulse 2s infinite;
        }
        
        .eclipse-splash-status {
            margin-top: 30px;
            font-size: 16px;
            color: var(--eclipse-text-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .eclipse-splash-status-dot {
            width: 10px;
            height: 10px;
            background: var(--eclipse-primary);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
            box-shadow: 0 0 10px var(--eclipse-primary);
        }
        
        .eclipse-splash-credits {
            position: absolute;
            bottom: 30px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: var(--eclipse-text-muted);
            z-index: 2;
        }
        
        .eclipse-splash-credits strong {
            color: var(--eclipse-accent);
            font-weight: 600;
        }
        
        .eclipse-splash.fadeout {
            animation: fadeOut 0.5s forwards;
        }
        
        @keyframes fadeOut {
            to { opacity: 0; pointer-events: none; }
        }
        
        /* Resto do CSS permanece igual... */
        .eclipse-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            max-width: 320px;
            width: calc(100vw - 48px);
            background: var(--eclipse-surface);
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            z-index: 999999;
            transition: all 0.3s ease;
            opacity: 1;
            transform: translateY(0);
            border-left: 3px solid var(--eclipse-primary);
        }
        
        .eclipse-toast-success {
            border-left-color: var(--eclipse-success);
        }
        
        .eclipse-toast-error {
            border-left-color: var(--eclipse-error);
        }
        
        .eclipse-toast-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .eclipse-toast-message {
            font-size: 14px;
            color: var(--eclipse-text);
            flex: 1;
        }
        
        .eclipse-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--eclipse-primary), var(--eclipse-primary-light));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100000;
            color: white;
            font-size: 28px;
            box-shadow: 0 6px 16px rgba(255, 42, 109, 0.35);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 99999;
            overflow: hidden;
            transform: scale(1);
        }
        
        .eclipse-toggle:hover {
            transform: scale(1.08) translateY(-3px);
            box-shadow: 0 10px 24px rgba(255, 42, 109, 0.45);
        }
        
        .eclipse-toggle:active {
            transform: scale(1) translateY(0);
            box-shadow: 0 4px 12px rgba(255, 42, 109, 0.3);
        }
        
        .eclipse-toggle.bounce {
            animation: bounce 0.5s;
        }
        
        .eclipse-toggle.float {
            animation: float 3s ease-in-out infinite;
        }
        
        .eclipse-panel {
            position: fixed;
            top: 120px;
            right: 40px;
            width: 360px;
            max-height: 75vh;
            background: var(--eclipse-bg);
            border-radius: 16px;
            border: 1px solid var(--eclipse-border);
            z-index: 99999;
            color: var(--eclipse-text);
            font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            display: none;
            overflow: hidden;
            transform: translateY(10px);
            opacity: 0;
            transition: all 0.3s ease;
            cursor: default;
        }
        
        .eclipse-panel.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .eclipse-header {
            padding: 20px 24px 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        
        .eclipse-title {
            font-weight: 700;
            font-size: 20px;
            background: linear-gradient(to right, white, var(--eclipse-accent-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .eclipse-title-icon {
            font-size: 22px;
        }
        
        .eclipse-version {
            font-size: 13px;
            color: var(--eclipse-text-muted);
            background: rgba(42, 42, 58, 0.5);
            padding: 3px 8px;
            border-radius: 6px;
            font-weight: 500;
        }
        
        /* ... resto do CSS permanece igual ... */
    `;
    document.head.appendChild(style);

    // Função para criar efeito Matrix Rain
    function createMatrixRain() {
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-rain';
        
        const columns = Math.floor(window.innerWidth / 20);
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@!%^&*()';
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${i * 20}px`;
            column.style.setProperty('--delay', Math.random() * 5);
            column.style.setProperty('--opacity', Math.random() * 0.5 + 0.1);
            
            // Adiciona caracteres à coluna
            const charCount = Math.floor(Math.random() * 10) + 10;
            for (let j = 0; j < charCount; j++) {
                const char = document.createElement('div');
                char.textContent = characters.charAt(Math.floor(Math.random() * characters.length));
                char.style.color = j === 0 ? '#ffffff' : `hsl(${120 + j * 10}, 100%, ${70 - j * 3}%)`;
                column.appendChild(char);
            }
            
            matrixContainer.appendChild(column);
        }
        
        return matrixContainer;
    }

    // Intercepta respostas para revelar respostas
    const originalParse = JSON.parse;
    JSON.parse = function(text, reviver) {
        let data = originalParse(text, reviver);
        if (features.revealAnswers && data && data.data) {
            try {
                const dataValues = Object.values(data.data);
                for (const val of dataValues) {
                    if (val && val.item && val.item.itemData) {
                        let itemData = JSON.parse(val.item.itemData);
                        if (itemData.question && itemData.question.widgets) {
                            for (const widget of Object.values(itemData.question.widgets)) {
                                if (widget.options && widget.options.choices) {
                                    widget.options.choices.forEach(choice => {
                                        if (choice.correct) {
                                            choice.content = "✅ " + choice.content;
                                        }
                                    });
                                }
                            }
                        }
                        val.item.itemData = JSON.stringify(itemData);
                    }
                }
                showToast("Respostas reveladas com sucesso", "success", 2000);
            } catch (e) {}
        }
        return data;
    };

    // Intercepta requisições para modificar questões
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        let [input, init] = args;
        const originalResponse = await originalFetch.apply(this, args);
        if (features.questionSpoof && originalResponse.ok) {
            const clonedResponse = originalResponse.clone();
            try {
                let responseObj = await clonedResponse.json();
                if (responseObj && responseObj.data && responseObj.data.assessmentItem && responseObj.data.assessmentItem.item && responseObj.data.assessmentItem.item.itemData) {
                    const phrases = [
                        "🚀 Feito por [@cupiditys & @bakai](https://github.com/KilluaWq)",
                        "💫 Créditos para [@cupiditys & @bakai](https://github.com/KilluaWq)",
                        "🔭 Acesse o GitHub do [@cupiditys & @bakai](https://github.com/KilluaWq)",
                        "🌌 Platform Destroyer sempre em frente",
                        "🌠 Destruindo plataformas desde 2024"
                    ];
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
                    itemData.question.widgets = { 
                        "radio 1": { 
                            type: "radio", 
                            options: { 
                                choices: [
                                    { content: "✅ Correto", correct: true }, 
                                    { content: "❌ Errado (nao clique aqui animal)", correct: false }
                                ] 
                            } 
                        } 
                    };
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    showToast("Questão modificada com sucesso", "success", 2000);
                    return new Response(JSON.stringify(responseObj), { 
                        status: 200, 
                        statusText: "OK", 
                        headers: originalResponse.headers 
                    });
                }
            } catch (e) {}
        }
        return originalResponse;
    };

    // Loop para FPS
    let lastFrameTime = performance.now();
    let frameCount = 0;
    function gameLoop() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 1000) {
            const fpsCounter = document.getElementById("eclipse-fps");
            if (fpsCounter) fpsCounter.textContent = `✨ ${frameCount}`;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(gameLoop);
    }

    // Loop de resposta automática
    (async function autoAnswerLoop() {
        while (true) {
            if (features.autoAnswer) {
                const click = (selector) => { 
                    const e = document.querySelector(selector); 
                    if(e) e.click(); 
                };
                click('[data-testid="choice-icon__library-choice-icon"]');
                await delay(100);
                click('[data-testid="exercise-check-answer"]');
                await delay(100);
                click('[data-testid="exercise-next-question"]');
            }
            await delay(config.autoAnswerDelay * 1000);
        }
    })();

    // Inicializa a UI
    (async function initializeUI() {
        // Cria o splash screen animado
        const splash = document.createElement("div");
        splash.className = "eclipse-splash";
        splash.innerHTML = `
            <div class="eclipse-splash-content">
                <div class="eclipse-splash-title">PLATFORM DESTROYER</div>
                <div class="eclipse-splash-subtitle">INICIALIZANDO SISTEMA DE DESTRUIÇÃO</div>
                <div class="eclipse-splash-loader">
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-core"></div>
                </div>
                <div class="eclipse-splash-status">
                    <div class="eclipse-splash-status-dot"></div>
                    <div>CARREGANDO MÓDULOS PRINCIPAIS</div>
                </div>
            </div>
            <div class="eclipse-splash-credits">
                DESENVOLVIDO POR <strong>@CUPIDITYS</strong> & <strong>@BAKAI</strong> • PLATFORM DESTROYER v2.1
            </div>
        `;
        
        // Adiciona o efeito Matrix Rain
        splash.appendChild(createMatrixRain());
        document.body.appendChild(splash);

        // Carrega o Dark Reader
        function loadScript(src, id) {
            return new Promise((resolve, reject) => {
                if (document.getElementById(id)) return resolve();
                const script = document.createElement('script');
                script.src = src; 
                script.id = id;
                script.onload = resolve; 
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // Carrega o Dark Reader
        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader').then(() => {
            DarkReader.setFetchMethod(window.fetch);
            if (features.darkMode) DarkReader.enable();
        });

        // Simula carregamento progressivo
        const statusText = splash.querySelector('.eclipse-splash-status div:last-child');
        const steps = [
            "INICIALIZANDO MÓDULOS PRINCIPAIS",
            "CARREGANDO SISTEMA DE AUTOMAÇÃO", 
            "CONFIGURANDO INTERFACE",
            "ATIVANDO RECURSOS AVANÇADOS",
            "SISTEMA PRONTO"
        ];
        
        for (let i = 0; i < steps.length; i++) {
            await delay(800);
            if (statusText) statusText.textContent = steps[i];
        }

        // Faz o splash screen desaparecer suavemente
        splash.classList.add("fadeout");
        
        // Espera a animação de fadeout terminar
        await delay(500);
        splash.remove();

        // O resto do código permanece igual...
        // CRIA O BOTÃO DE MENU
        const toggleBtn = document.createElement("div");
        toggleBtn.className = "eclipse-toggle float";
        toggleBtn.innerHTML = "☰";
        
        toggleBtn.onclick = () => {
            const p = document.getElementById("eclipse-panel");
            if (p) {
                if (p.style.display === "block") {
                    p.style.display = "none";
                    toggleBtn.classList.remove('active');
                    toggleBtn.classList.remove('float');
                } else {
                    p.style.display = "block";
                    setTimeout(() => {
                        p.classList.add("active");
                        toggleBtn.classList.add('active');
                        toggleBtn.classList.add('float');
                    }, 10);
                }
            }
        };
        
        document.body.appendChild(toggleBtn);
        
        // Cria o painel principal (atualizando o título e créditos)
        const panel = document.createElement("div");
        panel.id = "eclipse-panel";
        panel.className = "eclipse-panel";
        panel.innerHTML = `
            <div class="eclipse-header">
                <div class="eclipse-title">
                    <span class="eclipse-title-icon">💥</span>
                    Platform Destroyer
                </div>
                <div class="eclipse-version">v2.1</div>
            </div>
            <div class="eclipse-tabs">
                <div class="eclipse-tab active" data-tab="main">Principal</div>
                <div class="eclipse-tab" data-tab="visual">Visual</div>
                <div class="eclipse-tab" data-tab="about">Sobre</div>
            </div>
            <div id="eclipse-tab-main" class="eclipse-tab-content active">
                <button id="eclipse-btn-auto" class="eclipse-button">
                    <span class="eclipse-icon">⚡</span>
                    <span>Resposta Automática</span>
                </button>
                <button id="eclipse-btn-reveal" class="eclipse-button">
                    <span class="eclipse-icon">🔍</span>
                    <span>Revelar Respostas</span>
                </button>
                <button id="eclipse-btn-question" class="eclipse-button">
                    <span class="eclipse-icon">📝</span>
                    <span>Modificar Questões</span>
                </button>
                <button id="eclipse-btn-video" class="eclipse-button">
                    <span class="eclipse-icon">▶️</span>
                    <span>Modificar Vídeos</span>
                </button>
                
                <div class="eclipse-input-group">
                    <div class="eclipse-input-label">
                        <span>Velocidade de Resposta</span>
                        <span class="eclipse-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span>
                    </div>
                    <div class="eclipse-range-container">
                        <input type="range" class="eclipse-range" id="eclipse-speed" value="${config.autoAnswerDelay}" min="1.5" max="2.5" step="0.1">
                        <div class="eclipse-range-track" style="width: ${((config.autoAnswerDelay - 1.5) / 1.0) * 100}%"></div>
                        <div class="eclipse-range-marks">
                            <div class="eclipse-range-mark ${config.autoAnswerDelay <= 1.7 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 1.7 && config.autoAnswerDelay <= 1.9 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 1.9 && config.autoAnswerDelay <= 2.1 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 2.1 && config.autoAnswerDelay <= 2.3 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 2.3 ? 'active' : ''}"></div>
                        </div>
                        <div class="eclipse-range-labels">
                            <div>Lenta</div>
                            <div>Normal</div>
                            <div>Rápida</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="eclipse-tab-visual" class="eclipse-tab-content">
                <button id="eclipse-btn-dark" class="eclipse-button active">
                    <span class="eclipse-icon">🌓</span>
                    <span>Modo Escuro</span>
                </button>
                <button id="eclipse-btn-rgb" class="eclipse-button">
                    <span class="eclipse-icon">🎨</span>
                    <span>Logo RGB Dinâmico</span>
                </button>
            </div>
            <div id="eclipse-tab-about" class="eclipse-tab-content">
                <div class="eclipse-about-content">
                    <p>Um sistema avançado de destruição de plataformas educacionais, projetado para dominar qualquer ambiente de aprendizado com recursos poderosos e interface futurista.</p>
                    
                    <div class="eclipse-features">
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Destruição Inteligente</div>
                            <div>Automação avançada com controle total do sistema</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Domínio Completo</div>
                            <div>Controle total sobre questões, respostas e conteúdo</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Interface Futurista</div>
                            <div>Design cyberpunk com efeitos visuais impressionantes</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Performance Máxima</div>
                            <div>Otimizado para velocidade e eficiência máxima</div>
                        </div>
                    </div>
                    
                    <div class="eclipse-social-links">
                        <a href="https://discord.gg/QAm62DDJ" target="_blank" class="eclipse-social-btn">
                            <span class="eclipse-social-icon">💬</span>
                            <span>Discord</span>
                        </a>
                        <a href="https://github.com/KilluaWq" target="_blank" class="eclipse-social-btn">
                            <span class="eclipse-social-icon">🐙</span>
                            <span>GitHub</span>
                        </a>
                    </div>
                    
                    <div class="eclipse-credits">
                        Desenvolvido com 💥 por <a href="https://github.com/KilluaWq" target="_blank">@cupiditys & @bakai</a><br>
                        Platform Destroyer • Dominando plataformas desde 2024
                    </div>
                </div>
            </div>
            <div class="eclipse-footer">
                <a href="https://discord.gg/QAm62DDJ" target="_blank">
                    <span>Comunidade Platform Destroyer</span>
                </a>
                <span id="eclipse-fps">✨ ...</span>
            </div>
        `;
        document.body.appendChild(panel);

        // ... resto do código JavaScript permanece igual
    })();
})();