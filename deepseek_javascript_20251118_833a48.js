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
            --eclipse-bg: #0a1128;
            --eclipse-surface: #132347;
            --eclipse-border: #1e3a8a;
            --eclipse-primary: #2563eb;
            --eclipse-primary-light: #3b82f6;
            --eclipse-accent: #60a5fa;
            --eclipse-text: #e0f2fe;
            --eclipse-text-muted: #93c5fd;
            --eclipse-success: #22c55e;
            --eclipse-error: #ef4444;
            --eclipse-warning: #f59e0b;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.6); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(37, 99, 235, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        
        @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.4); }
            50% { box-shadow: 0 0 30px rgba(37, 99, 235, 0.8); }
        }
        
        /* Tela de Carregamento - Platform Destroyer */
        .eclipse-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #001f3f, #003366, #004080);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            color: white;
            font-family: 'Inter', sans-serif;
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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
                radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(96, 165, 250, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
            z-index: 0;
            animation: gradientShift 6s ease-in-out infinite;
        }

        .eclipse-splash::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(2px 2px at 20px 20px, rgba(96, 165, 250, 0.3) 1px, transparent 1px),
                radial-gradient(2px 2px at 40px 60px, rgba(59, 130, 246, 0.2) 1px, transparent 1px);
            background-size: 60px 60px, 90px 90px;
            opacity: 0.4;
            z-index: 1;
        }

        .eclipse-splash-content {
            position: relative;
            z-index: 2;
            text-align: center;
            transform: translateY(0);
            animation: float 4s ease-in-out infinite;
        }

        .eclipse-splash-title {
            font-size: 64px;
            font-weight: 800;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            background-size: 200% 200%;
            animation: gradientFlow 3s ease-in-out infinite;
            letter-spacing: 2px;
            text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        }

        .eclipse-splash-subtitle {
            font-size: 20px;
            color: #bfdbfe;
            margin-bottom: 50px;
            font-weight: 300;
            letter-spacing: 3px;
            opacity: 0.9;
        }

        .eclipse-splash-loader {
            width: 100px;
            height: 100px;
            position: relative;
            margin-bottom: 40px;
        }

        .eclipse-splash-loader-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 24px;
            background: #3b82f6;
            border-radius: 50%;
            z-index: 3;
            animation: pulse 2s ease-in-out infinite;
            box-shadow: 0 0 20px #3b82f6;
        }

        .eclipse-splash-loader-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-radius: 50%;
            animation: orbit 3s linear infinite;
        }

        .eclipse-splash-loader-ring:nth-child(1) {
            border-top-color: #3b82f6;
            animation-duration: 2s;
        }

        .eclipse-splash-loader-ring:nth-child(2) {
            border-right-color: #60a5fa;
            animation-duration: 3s;
            animation-direction: reverse;
        }

        .eclipse-splash-loader-ring:nth-child(3) {
            border-bottom-color: #93c5fd;
            animation-duration: 4s;
        }

        .eclipse-splash-status {
            margin-top: 40px;
            font-size: 16px;
            color: #bfdbfe;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(19, 35, 71, 0.8);
            padding: 12px 24px;
            border-radius: 25px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .eclipse-splash-status-dot {
            width: 10px;
            height: 10px;
            background: #3b82f6;
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
        }

        .eclipse-splash.fadeout {
            animation: fadeOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeOut {
            to { opacity: 0; pointer-events: none; }
        }

        @keyframes gradientShift {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        /* Botão de Menu - CORRIGIDO */
        .eclipse-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, var(--eclipse-primary), var(--eclipse-primary-light));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100000;
            color: white;
            font-size: 32px;
            box-shadow: 
                0 8px 32px rgba(37, 99, 235, 0.4),
                0 4px 16px rgba(37, 99, 235, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
        }

        .eclipse-toggle:hover {
            transform: scale(1.1) translateY(-5px);
            box-shadow: 
                0 12px 40px rgba(37, 99, 235, 0.5),
                0 6px 20px rgba(37, 99, 235, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .eclipse-toggle:active {
            transform: scale(1.05) translateY(-2px);
        }

        .eclipse-toggle.float {
            animation: float 3s ease-in-out infinite;
        }

        .eclipse-toggle.active {
            background: linear-gradient(135deg, var(--eclipse-accent), #93c5fd);
            animation: glow 2s ease-in-out infinite;
        }

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
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            font-family: 'Inter', sans-serif;
            z-index: 999999;
            transition: all 0.3s ease;
            opacity: 1;
            transform: translateY(0);
            border-left: 4px solid var(--eclipse-primary);
            backdrop-filter: blur(20px);
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
        
        .eclipse-panel {
            position: fixed;
            top: 120px;
            right: 40px;
            width: 380px;
            max-height: 75vh;
            background: var(--eclipse-bg);
            border-radius: 16px;
            border: 1px solid var(--eclipse-border);
            z-index: 99999;
            color: var(--eclipse-text);
            font-family: 'Inter', sans-serif;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            display: none;
            overflow: hidden;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(20px);
        }
        
        .eclipse-panel.active {
            transform: translateY(0);
            opacity: 1;
            display: block;
        }
        
        .eclipse-header {
            padding: 20px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, var(--eclipse-surface), rgba(30, 58, 138, 0.3));
            border-bottom: 1px solid var(--eclipse-border);
        }
        
        .eclipse-title {
            font-weight: 700;
            font-size: 22px;
            background: linear-gradient(to right, #bfdbfe, #93c5fd, #60a5fa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .eclipse-title-icon {
            font-size: 24px;
        }
        
        .eclipse-version {
            font-size: 12px;
            color: var(--eclipse-text-muted);
            background: rgba(30, 58, 138, 0.5);
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 500;
        }
        
        .eclipse-tabs {
            display: flex;
            padding: 0 8px;
            margin: 0 16px;
            border-radius: 10px;
            background: var(--eclipse-surface);
            overflow: hidden;
            border: 1px solid var(--eclipse-border);
        }
        
        .eclipse-tab {
            flex: 1;
            padding: 14px 0;
            cursor: pointer;
            color: var(--eclipse-text-muted);
            font-weight: 500;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .eclipse-tab:hover {
            color: var(--eclipse-primary-light);
        }
        
        .eclipse-tab.active {
            color: white;
            font-weight: 600;
        }
        
        .eclipse-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background: var(--eclipse-primary);
            border-radius: 3px;
        }
        
        .eclipse-tab-content {
            padding: 20px;
            display: none;
            max-height: 480px;
            overflow-y: auto;
        }
        
        .eclipse-tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        
        .eclipse-tab-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .eclipse-tab-content::-webkit-scrollbar-track {
            background: rgba(30, 58, 138, 0.3);
            border-radius: 3px;
        }
        
        .eclipse-tab-content::-webkit-scrollbar-thumb {
            background: var(--eclipse-primary);
            border-radius: 3px;
        }
        
        .eclipse-button {
            width: 100%;
            padding: 16px;
            background: var(--eclipse-surface);
            color: var(--eclipse-text);
            border: 1px solid var(--eclipse-border);
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            text-align: left;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
        }
        
        .eclipse-button:hover {
            border-color: var(--eclipse-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }
        
        .eclipse-button.active {
            background: rgba(37, 99, 235, 0.15);
            border-color: var(--eclipse-primary);
            color: white;
        }
        
        .eclipse-button.active::after {
            content: 'ATIVADO';
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(37, 99, 235, 0.25);
            color: var(--eclipse-primary-light);
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 12px;
            font-weight: 600;
        }
        
        .eclipse-icon {
            width: 26px;
            height: 26px;
            min-width: 26px;
            background: rgba(30, 58, 138, 0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.25s ease;
        }
        
        .eclipse-button:hover .eclipse-icon {
            background: var(--eclipse-primary);
            transform: scale(1.05);
        }
        
        .eclipse-button.active .eclipse-icon {
            background: var(--eclipse-primary);
        }
        
        .eclipse-input-group {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--eclipse-border);
        }
        
        .eclipse-input-label {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: var(--eclipse-text-muted);
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .eclipse-speed-value {
            font-weight: 600;
            color: var(--eclipse-primary);
        }
        
        .eclipse-range-container {
            position: relative;
            height: 50px;
            display: flex;
            align-items: center;
            margin-top: 8px;
        }
        
        .eclipse-range {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--eclipse-surface);
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        }
        
        .eclipse-range:focus {
            outline: none;
        }
        
        .eclipse-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            border: 2px solid var(--eclipse-primary);
            cursor: pointer;
            transition: all 0.15s ease;
            margin-top: -9px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .eclipse-range::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            background: var(--eclipse-primary);
        }
        
        .eclipse-range-track {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(90deg, var(--eclipse-primary), var(--eclipse-accent));
        }
        
        .eclipse-footer {
            padding: 16px;
            border-top: 1px solid var(--eclipse-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--eclipse-text-muted);
            background: rgba(19, 35, 71, 0.7);
        }
        
        .eclipse-footer a {
            color: var(--eclipse-primary);
            text-decoration: none;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .eclipse-footer a:hover {
            color: var(--eclipse-primary-light);
        }
        
        .eclipse-about-content {
            padding: 8px 0;
        }
        
        .eclipse-about-content p {
            color: var(--eclipse-text-muted);
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .eclipse-features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 16px 0;
        }
        
        .eclipse-feature {
            background: var(--eclipse-surface);
            border: 1px solid var(--eclipse-border);
            border-radius: 10px;
            padding: 14px;
            font-size: 13px;
            transition: all 0.2s ease;
        }
        
        .eclipse-feature:hover {
            transform: translateY(-2px);
            border-color: var(--eclipse-primary);
        }
        
        .eclipse-feature-title {
            font-weight: 600;
            color: var(--eclipse-primary);
            margin-bottom: 4px;
            font-size: 14px;
        }
        
        .eclipse-social-links {
            display: flex;
            gap: 16px;
            margin-top: 16px;
        }
        
        .eclipse-social-btn {
            flex: 1;
            padding: 12px;
            background: var(--eclipse-surface);
            border: 1px solid var(--eclipse-border);
            border-radius: 10px;
            color: var(--eclipse-text);
            text-decoration: none;
            text-align: center;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }
        
        .eclipse-social-btn:hover {
            border-color: var(--eclipse-primary);
            background: rgba(37, 99, 235, 0.1);
        }
        
        .eclipse-social-icon {
            font-size: 18px;
        }
        
        .eclipse-credits {
            font-size: 13px;
            color: var(--eclipse-text-muted);
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--eclipse-border);
            line-height: 1.5;
        }
        
        .eclipse-credits a {
            color: var(--eclipse-primary);
            text-decoration: none;
        }
        
        @media (max-width: 768px) {
            .eclipse-panel {
                width: calc(100vw - 48px);
                top: auto;
                bottom: 90px;
                right: 24px;
                max-height: 70vh;
            }
            
            .eclipse-toggle {
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
                font-size: 28px;
            }
        }
    `;
    document.head.appendChild(style);

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
                        "🚀 Platform Destroyer - Destruindo plataformas educacionais",
                        "💫 Desenvolvido por Cupiditys & Bakai",
                        "🔭 Acesse nosso Discord: Platform Destroyer",
                        "🌌 Sistema de automação avançado",
                        "🌠 Platform Destroyer - Sempre à frente"
                    ];
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
                    itemData.question.widgets = { 
                        "radio 1": { 
                            type: "radio", 
                            options: { 
                                choices: [
                                    { content: "✅ Correto", correct: true }, 
                                    { content: "❌ Errado", correct: false }
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
            if (fpsCounter) fpsCounter.textContent = `⚡ ${frameCount}`;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(gameLoop);
    }

    // Sistema de clique automático
    function findAndClickCorrect() {
        const elements = document.querySelectorAll('*');
        let foundCorrect = false;
        
        for (const element of elements) {
            if (element.textContent && (
                element.textContent.includes('Correto') || 
                element.textContent.includes('✅ Correto') ||
                element.textContent.toLowerCase().includes('correct')
            )) {
                let clickableElement = element;
                
                while (clickableElement && clickableElement !== document.body) {
                    const style = window.getComputedStyle(clickableElement);
                    if (style.cursor === 'pointer' || 
                        clickableElement.tagName === 'BUTTON' || 
                        clickableElement.tagName === 'DIV' && clickableElement.onclick ||
                        clickableElement.hasAttribute('onclick')) {
                        break;
                    }
                    clickableElement = clickableElement.parentElement;
                }
                
                if (clickableElement && clickableElement !== document.body) {
                    clickableElement.click();
                    showToast("✅ Resposta correta selecionada", "success", 1500);
                    foundCorrect = true;
                    break;
                } else {
                    element.click();
                    showToast("✅ Resposta correta selecionada", "success", 1500);
                    foundCorrect = true;
                    break;
                }
            }
        }
        
        return foundCorrect;
    }

    // Observador de mudanças na página
    let questionObserver = null;

    function startQuestionObserver() {
        if (questionObserver) return;
        
        questionObserver = new MutationObserver((mutations) => {
            if (features.autoAnswer) {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.textContent && (
                                node.textContent.includes('Correto') ||
                                node.textContent.includes('✅') ||
                                node.querySelector && node.querySelector('[data-testid*="choice"]')
                            )) {
                                setTimeout(() => {
                                    if (findAndClickCorrect()) {
                                        setTimeout(() => {
                                            const checkButton = document.querySelector('[data-testid="exercise-check-answer"], button:contains("Verificar"), button:contains("Check")');
                                            if (checkButton) {
                                                checkButton.click();
                                                showToast("📝 Verificando resposta...", "info", 1000);
                                            }
                                        }, 1000);
                                    }
                                }, 500);
                            }
                        }
                    });
                });
            }
        });

        questionObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Loop de resposta automática
    (async function autoAnswerLoop() {
        while (true) {
            if (features.autoAnswer) {
                if (findAndClickCorrect()) {
                    await delay(1200);
                    
                    const checkButtons = [
                        '[data-testid="exercise-check-answer"]',
                        'button:contains("Verificar")',
                        'button:contains("Check")'
                    ];
                    
                    for (const selector of checkButtons) {
                        try {
                            const buttons = document.querySelectorAll('button');
                            for (const button of buttons) {
                                if (button.textContent && (
                                    button.textContent.includes('Verificar') ||
                                    button.textContent.includes('Check')
                                )) {
                                    button.click();
                                    showToast("🔍 Verificando resposta...", "info", 1000);
                                    break;
                                }
                            }
                        } catch (e) {}
                    }
                    
                    await delay(1500);
                    
                    const nextButtons = [
                        '[data-testid="exercise-next-question"]',
                        'button:contains("Próxima")',
                        'button:contains("Next")'
                    ];
                    
                    for (const selector of nextButtons) {
                        try {
                            const buttons = document.querySelectorAll('button');
                            for (const button of buttons) {
                                if (button.textContent && (
                                    button.textContent.includes('Próxima') ||
                                    button.textContent.includes('Next')
                                )) {
                                    button.click();
                                    showToast("➡️ Indo para próxima questão...", "info", 1000);
                                    break;
                                }
                            }
                        } catch (e) {}
                    }
                }
            }
            await delay(config.autoAnswerDelay * 1000);
        }
    })();

    // Inicializa a UI
    (async function initializeUI() {
        // Cria o splash screen
        const splash = document.createElement("div");
        splash.className = "eclipse-splash";
        splash.innerHTML = `
            <div class="eclipse-splash-content">
                <div class="eclipse-splash-title">PLATFORM DESTROYER</div>
                <div class="eclipse-splash-subtitle">CARREGANDO SISTEMA</div>
                <div class="eclipse-splash-loader">
                    <div class="eclipse-splash-loader-core"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                </div>
                <div class="eclipse-splash-status">
                    <div class="eclipse-splash-status-dot"></div>
                    <div>INICIALIZANDO SISTEMA</div>
                </div>
            </div>
        `;
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

        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader').then(() => {
            DarkReader.setFetchMethod(window.fetch);
            if (features.darkMode) DarkReader.enable();
        });

        // Espera e remove splash
        await delay(2500);
        splash.classList.add("fadeout");
        await delay(1000);

        // Inicia observador de questões
        startQuestionObserver();

        // CRIA O BOTÃO DE MENU - CORRIGIDO
        const toggleBtn = document.createElement("div");
        toggleBtn.className = "eclipse-toggle float";
        toggleBtn.innerHTML = "☰";
        document.body.appendChild(toggleBtn);

        // Cria o painel principal
        const panel = document.createElement("div");
        panel.id = "eclipse-panel";
        panel.className = "eclipse-panel";
        panel.innerHTML = `
            <div class="eclipse-header">
                <div class="eclipse-title">
                    <span class="eclipse-title-icon">💥</span>
                    Platform Destroyer
                </div>
                <div class="eclipse-version">v3.0</div>
            </div>
            <div class="eclipse-tabs">
                <div class="eclipse-tab active" data-tab="main">Principal</div>
                <div class="eclipse-tab" data-tab="visual">Visual</div>
                <div class="eclipse-tab" data-tab="about">Sobre</div>
            </div>
            <div id="eclipse-tab-main" class="eclipse-tab-content active">
                <button id="eclipse-btn-auto" class="eclipse-button">
                    <span class="eclipse-icon">🤖</span>
                    <span>Resposta Automática</span>
                </button>
                <button id="eclipse-btn-reveal" class="eclipse-button">
                    <span class="eclipse-icon">👁️</span>
                    <span>Revelar Respostas</span>
                </button>
                <button id="eclipse-btn-question" class="eclipse-button">
                    <span class="eclipse-icon">🎭</span>
                    <span>Modificar Questões</span>
                </button>
                <button id="eclipse-btn-video" class="eclipse-button">
                    <span class="eclipse-icon">📹</span>
                    <span>Modificar Vídeos</span>
                </button>
                
                <div class="eclipse-input-group">
                    <div class="eclipse-input-label">
                        <span>Velocidade de Resposta</span>
                        <span class="eclipse-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span>
                    </div>
                    <div class="eclipse-range-container">
                        <input type="range" class="eclipse-range" id="eclipse-speed" value="${config.autoAnswerDelay}" min="1.0" max="3.0" step="0.1">
                        <div class="eclipse-range-track" style="width: ${((config.autoAnswerDelay - 1.0) / 2.0) * 100}%"></div>
                    </div>
                </div>
            </div>
            <div id="eclipse-tab-visual" class="eclipse-tab-content">
                <button id="eclipse-btn-dark" class="eclipse-button active">
                    <span class="eclipse-icon">🌙</span>
                    <span>Modo Escuro</span>
                </button>
                <button id="eclipse-btn-rgb" class="eclipse-button">
                    <span class="eclipse-icon">🌈</span>
                    <span>Efeitos RGB</span>
                </button>
            </div>
            <div id="eclipse-tab-about" class="eclipse-tab-content">
                <div class="eclipse-about-content">
                    <p>Sistema avançado de automação e personalização desenvolvido para otimizar sua experiência em plataformas educacionais.</p>
                    
                    <div class="eclipse-features">
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Automação Inteligente</div>
                            <div>Respostas automáticas com tecnologia avançada</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Modificação em Tempo Real</div>
                            <div>Alteração dinâmica de questões e conteúdo</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Interface Moderna</div>
                            <div>Design azul com efeitos visuais impressionantes</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Performance Máxima</div>
                            <div>Funcionamento otimizado sem lag</div>
                        </div>
                    </div>
                    
                    <div class="eclipse-social-links">
                        <a href="https://discord.gg/platformdestroyer" target="_blank" class="eclipse-social-btn">
                            <span class="eclipse-social-icon">💬</span>
                            <span>Discord</span>
                        </a>
                        <a href="https://github.com/KilluaWq" target="_blank" class="eclipse-social-btn">
                            <span class="eclipse-social-icon">⚡</span>
                            <span>GitHub</span>
                        </a>
                    </div>
                    
                    <div class="eclipse-credits">
                        Desenvolvido com ❤ por <a href="https://github.com/Cupiditys" target="_blank">Cupiditys</a> & <a href="https://github.com/KilluaWq" target="_blank">Bakai</a><br>
                        <strong>Platform Destroyer</strong> - Destruindo barreiras educacionais
                    </div>
                </div>
            </div>
            <div class="eclipse-footer">
                <a href="https://discord.gg/platformdestroyer" target="_blank">
                    <span>Platform Destroyer</span>
                </a>
                <span id="eclipse-fps">⚡ ...</span>
            </div>
        `;
        document.body.appendChild(panel);

        // EVENT LISTENER CORRIGIDO para o botão de menu
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const panel = document.getElementById("eclipse-panel");
            if (panel) {
                if (panel.classList.contains('active')) {
                    panel.classList.remove('active');
                    toggleBtn.classList.remove('active');
                    // Esconde o painel após a transição
                    setTimeout(() => {
                        panel.style.display = 'none';
                    }, 300);
                } else {
                    panel.style.display = 'block';
                    // Pequeno delay para garantir que o display block foi aplicado
                    setTimeout(() => {
                        panel.classList.add('active');
                        toggleBtn.classList.add('active');
                    }, 10);
                }
            }
        });

        // Fecha o painel ao clicar fora
        document.addEventListener('click', function(e) {
            const panel = document.getElementById("eclipse-panel");
            const toggleBtn = document.querySelector('.eclipse-toggle');
            
            if (panel && panel.classList.contains('active') && 
                !panel.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                panel.classList.remove('active');
                toggleBtn.classList.remove('active');
                setTimeout(() => {
                    panel.style.display = 'none';
                }, 300);
            }
        });

        // Configura os botões
        const setupToggleButton = (buttonId, featureName, callback) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    features[featureName] = !features[featureName];
                    button.classList.toggle('active', features[featureName]);
                    
                    if (callback) callback(features[featureName]);
                    
                    if (featureName === 'autoAnswer' && features[featureName]) {
                        showToast("🤖 Resposta automática ATIVADA", "success");
                        setTimeout(() => findAndClickCorrect(), 500);
                    } else if (featureName === 'autoAnswer' && !features[featureName]) {
                        showToast("🤖 Resposta automática DESATIVADA", "info");
                    }
                    
                    const action = features[featureName] ? "ativado" : "desativado";
                    const featureText = button.querySelector('span:last-child').textContent;
                    if (featureName !== 'autoAnswer') {
                        showToast(`${featureText} ${action}`, features[featureName] ? "success" : "info");
                    }
                });
            }
        };
        
        setupToggleButton('eclipse-btn-auto', 'autoAnswer');
        setupToggleButton('eclipse-btn-question', 'questionSpoof');
        setupToggleButton('eclipse-btn-video', 'videoSpoof');
        setupToggleButton('eclipse-btn-reveal', 'revealAnswers');
        setupToggleButton('eclipse-btn-dark', 'darkMode', (isActive) => {
            if (typeof DarkReader === 'undefined') return;
            isActive ? DarkReader.enable() : DarkReader.disable();
        });
        setupToggleButton('eclipse-btn-rgb', 'rgbLogo', (isActive) => {
            const khanLogo = document.querySelector('path[fill="#14bf96"]');
            if (khanLogo) {
                khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
            }
        });

        // Configura o controle de velocidade
        const speedInput = document.getElementById('eclipse-speed');
        const speedValue = document.querySelector('.eclipse-speed-value');
        const rangeTrack = document.querySelector('.eclipse-range-track');
        
        if (speedInput && speedValue && rangeTrack) {
            const updateSpeedUI = () => {
                const value = parseFloat(speedInput.value);
                const percent = ((value - 1.0) / 2.0) * 100;
                speedValue.textContent = `${value.toFixed(1)}s`;
                rangeTrack.style.width = `${percent}%`;
            };
            
            updateSpeedUI();
            speedInput.addEventListener('input', updateSpeedUI);
            speedInput.addEventListener('change', () => {
                config.autoAnswerDelay = parseFloat(speedInput.value);
                showToast(`⚡ Velocidade: ${config.autoAnswerDelay.toFixed(1)}s`, "info", 1500);
            });
        }
        
        // Configura as abas
        document.querySelectorAll('.eclipse-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.eclipse-tab, .eclipse-tab-content').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`eclipse-tab-${tab.dataset.tab}`).classList.add('active');
            });
        });
        
        // Inicia o game loop
        gameLoop();
    })();
})();