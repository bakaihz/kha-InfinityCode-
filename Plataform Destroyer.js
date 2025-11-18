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
            --eclipse-surface: #151521;
            --eclipse-border: #2a2a3a;
            --eclipse-primary: #ff2a6d;
            --eclipse-primary-light: #ff5c8d;
            --eclipse-accent: #05d9e8;
            --eclipse-text: #ffffff;
            --eclipse-text-muted: #b8b8d0;
            --eclipse-success: #00ff88;
            --eclipse-error: #ff2a6d;
            --eclipse-warning: #ffcc00;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 42, 109, 0.6); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(255, 42, 109, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 42, 109, 0); }
        }
        
        @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes matrixRain {
            0% { transform: translateY(-100px); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
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
        
        /* Tela de Carregamento - Platform Destroyer */
        .eclipse-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #000000, #0a0a2a, #1a0033);
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
                radial-gradient(circle at 20% 30%, rgba(255, 42, 109, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(5, 217, 232, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(0, 255, 136, 0.08) 0%, transparent 50%);
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
                linear-gradient(90deg, transparent 79px, rgba(255, 42, 109, 0.1) 81px, transparent 82px),
                linear-gradient(rgba(5, 217, 232, 0.1) 1px, transparent 1px);
            background-size: 100px 100px, 20px 20px;
            opacity: 0.3;
            z-index: 1;
        }

        .matrix-rain {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        }

        .matrix-char {
            position: absolute;
            color: #00ff88;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            animation: matrixRain 3s linear infinite;
            text-shadow: 0 0 8px #00ff88;
            opacity: 0;
        }

        .eclipse-splash-content {
            position: relative;
            z-index: 3;
            text-align: center;
            transform: translateY(0);
            animation: contentFloat 4s ease-in-out infinite;
        }

        .eclipse-splash-title {
            font-size: 64px;
            font-weight: 800;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #ff2a6d 0%, #05d9e8 50%, #00ff88 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            background-size: 300% 300%;
            animation: gradientFlow 4s ease-in-out infinite, glitch 0.5s infinite;
            letter-spacing: 3px;
            text-shadow: 0 0 30px rgba(255, 42, 109, 0.7);
            text-transform: uppercase;
        }

        .eclipse-splash-subtitle {
            font-size: 20px;
            color: #05d9e8;
            margin-bottom: 50px;
            font-weight: 300;
            letter-spacing: 8px;
            opacity: 0.9;
            text-shadow: 0 0 20px rgba(5, 217, 232, 0.5);
            animation: glitch 2s infinite;
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
            background: #ff2a6d;
            border-radius: 50%;
            z-index: 4;
            animation: corePulse 1.5s ease-in-out infinite;
            box-shadow: 
                0 0 20px #ff2a6d,
                0 0 40px #ff2a6d,
                0 0 60px #ff2a6d;
        }

        .eclipse-splash-loader-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-radius: 50%;
            animation: orbit 3s linear infinite;
            box-shadow: 
                inset 0 0 10px currentColor,
                0 0 10px currentColor;
        }

        .eclipse-splash-loader-ring:nth-child(1) {
            border-top-color: #ff2a6d;
            animation-duration: 2s;
        }

        .eclipse-splash-loader-ring:nth-child(2) {
            border-right-color: #05d9e8;
            animation-duration: 3s;
            animation-direction: reverse;
        }

        .eclipse-splash-loader-ring:nth-child(3) {
            border-bottom-color: #00ff88;
            animation-duration: 4s;
        }

        .eclipse-splash-status {
            margin-top: 40px;
            font-size: 16px;
            color: #b8b8d0;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(21, 21, 33, 0.8);
            padding: 12px 24px;
            border-radius: 25px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 42, 109, 0.3);
            box-shadow: 0 0 20px rgba(255, 42, 109, 0.2);
        }

        .eclipse-splash-status-dot {
            width: 10px;
            height: 10px;
            background: #00ff88;
            border-radius: 50%;
            animation: statusPulse 2s ease-in-out infinite;
            box-shadow: 0 0 10px #00ff88;
        }

        .eclipse-splash.fadeout {
            animation: smoothFadeOut 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Botão de Menu Melhorado */
        .eclipse-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--eclipse-primary), var(--eclipse-primary-light));
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            z-index: 100000;
            color: white;
            font-size: 36px;
            box-shadow: 
                0 10px 40px rgba(255, 42, 109, 0.4),
                0 5px 15px rgba(255, 42, 109, 0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.2),
                0 0 20px rgba(255, 42, 109, 0.5);
            font-family: 'Inter', sans-serif;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            transform: scale(1);
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
        }

        .eclipse-toggle::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.15) 0%, 
                rgba(255, 255, 255, 0.05) 50%, 
                transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .eclipse-toggle::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
                transparent,
                rgba(255, 255, 255, 0.2),
                rgba(5, 217, 232, 0.3),
                rgba(0, 255, 136, 0.2),
                transparent 70%
            );
            animation: rotate 3s linear infinite;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .eclipse-toggle:hover {
            transform: scale(1.15) translateY(-5px) rotate(5deg);
            box-shadow: 
                0 20px 50px rgba(255, 42, 109, 0.6),
                0 8px 25px rgba(255, 42, 109, 0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                0 0 30px rgba(255, 42, 109, 0.7);
        }

        .eclipse-toggle:hover::before {
            opacity: 1;
        }

        .eclipse-toggle:hover::after {
            opacity: 0.8;
        }

        .eclipse-toggle:active {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 
                0 15px 35px rgba(255, 42, 109, 0.5),
                0 5px 15px rgba(255, 42, 109, 0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.2);
            transition: all 0.1s ease;
        }

        .eclipse-toggle.bounce {
            animation: gentleBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .eclipse-toggle.float {
            animation: smoothFloat 4s ease-in-out infinite;
        }

        .eclipse-toggle.active {
            background: linear-gradient(135deg, var(--eclipse-accent), #00ff88);
            box-shadow: 
                0 10px 40px rgba(5, 217, 232, 0.4),
                0 5px 15px rgba(5, 217, 232, 0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.2),
                0 0 20px rgba(5, 217, 232, 0.5);
        }

        /* Novas Animações */
        @keyframes gradientShift {
            0%, 100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
            33% {
                transform: scale(1.1) rotate(120deg);
                opacity: 0.8;
            }
            66% {
                transform: scale(1.05) rotate(240deg);
                opacity: 0.9;
            }
        }

        @keyframes contentFloat {
            0%, 100% {
                transform: translateY(0px) rotateX(0deg);
            }
            25% {
                transform: translateY(-10px) rotateX(5deg);
            }
            75% {
                transform: translateY(-5px) rotateX(-5deg);
            }
        }

        @keyframes gradientFlow {
            0%, 100% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
        }

        @keyframes corePulse {
            0%, 100% {
                transform: translate(-50%, -50%) scale(1);
                box-shadow: 
                    0 0 20px #ff2a6d,
                    0 0 40px #ff2a6d,
                    0 0 60px #ff2a6d;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.3);
                box-shadow: 
                    0 0 30px #ff2a6d,
                    0 0 60px #ff2a6d,
                    0 0 90px #ff2a6d;
            }
        }

        @keyframes statusPulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
                box-shadow: 0 0 10px #00ff88;
            }
            50% {
                transform: scale(1.5);
                opacity: 0.7;
                box-shadow: 0 0 20px #00ff88;
            }
        }

        @keyframes smoothFadeOut {
            to {
                opacity: 0;
                transform: scale(1.2) rotate(10deg);
                filter: blur(10px);
                pointer-events: none;
            }
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        @keyframes gentleBounce {
            0%, 20%, 53%, 80%, 100% {
                transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            }
            0% {
                transform: scale(1) translateY(0);
            }
            20% {
                transform: scale(1.2) translateY(-10px);
            }
            53% {
                transform: scale(1.1) translateY(-5px);
            }
            80% {
                transform: scale(1.15) translateY(-2px);
            }
            100% {
                transform: scale(1) translateY(0);
            }
        }

        @keyframes smoothFloat {
            0%, 100% {
                transform: translateY(0) rotate(0deg);
            }
            25% {
                transform: translateY(-8px) rotate(2deg);
            }
            50% {
                transform: translateY(-4px) rotate(-1deg);
            }
            75% {
                transform: translateY(-6px) rotate(1deg);
            }
        }
        
        .eclipse-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            max-width: 380px;
            width: calc(100vw - 48px);
            background: var(--eclipse-surface);
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.4),
                0 0 20px rgba(255, 42, 109, 0.3);
            font-family: 'Inter', sans-serif;
            z-index: 999999;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            opacity: 1;
            transform: translateY(0);
            border-left: 4px solid var(--eclipse-primary);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 42, 109, 0.2);
        }
        
        .eclipse-toast-success {
            border-left-color: var(--eclipse-success);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 136, 0.3);
        }
        
        .eclipse-toast-error {
            border-left-color: var(--eclipse-error);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 42, 109, 0.3);
        }
        
        .eclipse-toast-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
        }
        
        .eclipse-toast-message {
            font-size: 15px;
            color: var(--eclipse-text);
            flex: 1;
            font-weight: 500;
        }
        
        .eclipse-panel {
            position: fixed;
            top: 120px;
            right: 40px;
            width: 400px;
            max-height: 75vh;
            background: var(--eclipse-bg);
            border-radius: 20px;
            border: 2px solid var(--eclipse-border);
            z-index: 99999;
            color: var(--eclipse-text);
            font-family: 'Inter', sans-serif;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.5),
                0 0 30px rgba(255, 42, 109, 0.2);
            display: none;
            overflow: hidden;
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: move;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
            backdrop-filter: blur(20px);
        }
        
        .eclipse-panel:active {
            cursor: grabbing;
        }
        
        .eclipse-panel.active {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        
        .eclipse-header {
            padding: 24px 28px 20px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            background: linear-gradient(135deg, var(--eclipse-surface), rgba(255, 42, 109, 0.1));
            border-bottom: 2px solid var(--eclipse-border);
            touch-action: none;
        }
        
        .eclipse-header:active {
            cursor: grabbing;
        }
        
        .eclipse-title {
            font-weight: 800;
            font-size: 24px;
            background: linear-gradient(135deg, #ff2a6d, #05d9e8, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 12px;
            text-shadow: 0 0 20px rgba(255, 42, 109, 0.5);
        }
        
        .eclipse-title-icon {
            font-size: 28px;
            animation: glitch 3s infinite;
        }
        
        .eclipse-version {
            font-size: 14px;
            color: var(--eclipse-text-muted);
            background: rgba(255, 42, 109, 0.2);
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: 600;
            border: 1px solid rgba(255, 42, 109, 0.3);
        }
        
        .eclipse-tabs {
            display: flex;
            padding: 0 12px;
            margin: 0 20px;
            border-radius: 12px;
            background: var(--eclipse-surface);
            overflow: hidden;
            border: 2px solid var(--eclipse-border);
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .eclipse-tab {
            flex: 1;
            padding: 16px 0;
            cursor: pointer;
            color: var(--eclipse-text-muted);
            font-weight: 600;
            font-size: 14px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            background: transparent;
            border: none;
            font-family: 'Inter', sans-serif;
        }
        
        .eclipse-tab:hover {
            color: var(--eclipse-primary-light);
            background: rgba(255, 42, 109, 0.1);
        }
        
        .eclipse-tab.active {
            color: white;
            font-weight: 700;
            background: linear-gradient(135deg, rgba(255, 42, 109, 0.2), rgba(5, 217, 232, 0.1));
        }
        
        .eclipse-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            background: linear-gradient(90deg, #ff2a6d, #05d9e8);
            border-radius: 3px;
            box-shadow: 0 0 10px #ff2a6d;
        }
        
        .eclipse-tab-content {
            padding: 20px;
            display: none;
            max-height: 480px;
            overflow-y: auto;
        }
        
        .eclipse-tab-content.active {
            display: block;
            animation: fadeIn 0.4s ease;
        }
        
        /* Custom scrollbar */
        .eclipse-tab-content::-webkit-scrollbar {
            width: 8px;
        }
        
        .eclipse-tab-content::-webkit-scrollbar-track {
            background: rgba(42, 42, 58, 0.3);
            border-radius: 4px;
        }
        
        .eclipse-tab-content::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #ff2a6d, #05d9e8);
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(255, 42, 109, 0.5);
        }
        
        .eclipse-button {
            width: 100%;
            padding: 20px;
            background: var(--eclipse-surface);
            color: var(--eclipse-text);
            border: 2px solid var(--eclipse-border);
            border-radius: 16px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            text-align: left;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }
        
        .eclipse-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 42, 109, 0.15), transparent);
            transition: all 0.8s ease;
        }
        
        .eclipse-button:hover::before {
            left: 100%;
        }
        
        .eclipse-button:hover {
            border-color: var(--eclipse-primary);
            transform: translateY(-4px) scale(1.02);
            box-shadow: 
                0 8px 25px rgba(255, 42, 109, 0.2),
                0 0 20px rgba(255, 42, 109, 0.1);
        }
        
        .eclipse-button:active {
            transform: translateY(-2px) scale(1.01);
        }
        
        .eclipse-button.active {
            background: linear-gradient(135deg, rgba(255, 42, 109, 0.2), rgba(5, 217, 232, 0.1));
            border-color: var(--eclipse-primary);
            color: white;
        }
        
        .eclipse-button.active::after {
            content: 'ATIVADO';
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #ff2a6d, #05d9e8);
            color: white;
            font-size: 12px;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 700;
            box-shadow: 0 0 15px rgba(255, 42, 109, 0.5);
        }
        
        .eclipse-icon {
            width: 32px;
            height: 32px;
            min-width: 32px;
            background: rgba(255, 42, 109, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 42, 109, 0.2);
        }
        
        .eclipse-button:hover .eclipse-icon {
            background: var(--eclipse-primary);
            transform: scale(1.1) rotate(10deg);
            box-shadow: 0 0 15px rgba(255, 42, 109, 0.5);
        }
        
        .eclipse-button.active .eclipse-icon {
            background: var(--eclipse-primary);
            box-shadow: 0 0 15px rgba(255, 42, 109, 0.5);
        }
        
        .eclipse-input-group {
            margin-top: 24px;
            padding-top: 20px;
            border-top: 2px solid var(--eclipse-border);
        }
        
        .eclipse-input-label {
            display: flex;
            justify-content: space-between;
            font-size: 15px;
            color: var(--eclipse-text-muted);
            margin-bottom: 12px;
            font-weight: 600;
        }
        
        .eclipse-speed-value {
            font-weight: 700;
            color: var(--eclipse-primary);
            text-shadow: 0 0 10px rgba(255, 42, 109, 0.5);
        }
        
        /* Barra de velocidade melhorada */
        .eclipse-range-container {
            position: relative;
            height: 60px;
            display: flex;
            align-items: center;
            margin-top: 12px;
        }
        
        .eclipse-range {
            width: 100%;
            height: 8px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--eclipse-surface);
            border-radius: 4px;
            position: relative;
            cursor: pointer;
            border: 1px solid var(--eclipse-border);
        }
        
        .eclipse-range:focus {
            outline: none;
        }
        
        .eclipse-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: white;
            border: 3px solid var(--eclipse-primary);
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: -10px;
            box-shadow: 
                0 0 20px rgba(255, 42, 109, 0.5),
                0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 2;
        }
        
        .eclipse-range::-webkit-slider-thumb:hover,
        .eclipse-range::-webkit-slider-thumb:active {
            transform: scale(1.3);
            background: var(--eclipse-primary);
            border-color: white;
            box-shadow: 
                0 0 30px rgba(255, 42, 109, 0.7),
                0 0 0 8px rgba(255, 42, 109, 0.3);
        }
        
        .eclipse-range-track {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 4px;
            background: linear-gradient(90deg, var(--eclipse-primary), var(--eclipse-accent));
            box-shadow: 0 0 15px rgba(255, 42, 109, 0.3);
        }
        
        .eclipse-range-marks {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 15px;
            pointer-events: none;
        }
        
        .eclipse-range-mark {
            width: 3px;
            height: 10px;
            background: var(--eclipse-text-muted);
            border-radius: 2px;
            transition: all 0.3s ease;
        }
        
        .eclipse-range-mark.active {
            height: 16px;
            background: var(--eclipse-primary);
            box-shadow: 0 0 10px var(--eclipse-primary);
        }
        
        .eclipse-range-labels {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 32px;
            font-size: 13px;
            color: var(--eclipse-text-muted);
            pointer-events: none;
            font-weight: 600;
        }
        
        .eclipse-footer {
            padding: 20px;
            border-top: 2px solid var(--eclipse-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: var(--eclipse-text-muted);
            background: linear-gradient(135deg, rgba(21, 21, 33, 0.8), rgba(255, 42, 109, 0.1));
        }
        
        .eclipse-footer a {
            color: var(--eclipse-primary);
            text-decoration: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
        }
        
        .eclipse-footer a:hover {
            color: var(--eclipse-accent);
            text-shadow: 0 0 10px rgba(5, 217, 232, 0.5);
        }
        
        .eclipse-about-content {
            padding: 12px 0;
        }
        
        .eclipse-about-content p {
            color: var(--eclipse-text-muted);
            font-size: 15px;
            line-height: 1.7;
            margin-bottom: 24px;
            text-align: center;
        }
        
        .eclipse-features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 20px 0;
        }
        
        @media (max-width: 400px) {
            .eclipse-features {
                grid-template-columns: 1fr;
            }
        }
        
        .eclipse-feature {
            background: var(--eclipse-surface);
            border: 2px solid var(--eclipse-border);
            border-radius: 12px;
            padding: 20px;
            font-size: 14px;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .eclipse-feature:hover {
            transform: translateY(-5px);
            border-color: var(--eclipse-primary);
            box-shadow: 
                0 8px 25px rgba(255, 42, 109, 0.2),
                0 0 20px rgba(255, 42, 109, 0.1);
        }
        
        .eclipse-feature-title {
            font-weight: 700;
            color: var(--eclipse-primary);
            margin-bottom: 8px;
            font-size: 16px;
            text-shadow: 0 0 10px rgba(255, 42, 109, 0.3);
        }
        
        .eclipse-social-links {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        
        .eclipse-social-btn {
            flex: 1;
            padding: 16px;
            background: var(--eclipse-surface);
            border: 2px solid var(--eclipse-border);
            border-radius: 12px;
            color: var(--eclipse-text);
            text-decoration: none;
            text-align: center;
            font-size: 14px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            font-weight: 600;
        }
        
        .eclipse-social-btn:hover {
            border-color: var(--eclipse-primary);
            background: rgba(255, 42, 109, 0.1);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(255, 42, 109, 0.2);
        }
        
        .eclipse-social-icon {
            font-size: 24px;
        }
        
        .eclipse-credits {
            font-size: 14px;
            color: var(--eclipse-text-muted);
            margin-top: 28px;
            padding-top: 20px;
            border-top: 2px solid var(--eclipse-border);
            line-height: 1.6;
            text-align: center;
        }
        
        .eclipse-credits a {
            color: var(--eclipse-primary);
            text-decoration: none;
            font-weight: 600;
        }
        
        .eclipse-credits a:hover {
            color: var(--eclipse-accent);
            text-shadow: 0 0 10px rgba(5, 217, 232, 0.5);
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
            .eclipse-panel {
                width: calc(100vw - 60px);
                top: auto;
                bottom: 100px;
                right: 30px;
                max-height: 70vh;
            }
            
            .eclipse-toggle {
                bottom: 30px;
                right: 30px;
                width: 70px;
                height: 70px;
                font-size: 32px;
            }
            
            .eclipse-toast {
                max-width: calc(100vw - 60px);
                bottom: 30px;
                right: 30px;
            }
            
            .eclipse-tabs {
                margin: 0 16px;
            }
            
            .eclipse-splash-title {
                font-size: 48px;
            }
            
            .eclipse-splash-subtitle {
                font-size: 16px;
            }
            
            .eclipse-splash-loader {
                width: 80px;
                height: 80px;
            }
        }

        @media (max-width: 480px) {
            .eclipse-splash-title {
                font-size: 36px;
            }
            
            .eclipse-splash-subtitle {
                font-size: 14px;
                margin-bottom: 40px;
            }
            
            .eclipse-splash-status {
                font-size: 14px;
                padding: 10px 20px;
            }
            
            .eclipse-toggle {
                width: 65px;
                height: 65px;
                bottom: 25px;
                right: 25px;
                font-size: 28px;
                border-radius: 20px;
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

    // Sistema de clique automático MELHORADO
    function findAndClickCorrect() {
        // Procura por "Correto" em diferentes elementos
        const elements = document.querySelectorAll('*');
        let foundCorrect = false;
        
        for (const element of elements) {
            if (element.textContent && (
                element.textContent.includes('Correto') || 
                element.textContent.includes('✅ Correto') ||
                element.textContent.toLowerCase().includes('correct')
            )) {
                // Tenta clicar no elemento ou em seus pais
                let clickableElement = element;
                
                // Procura por um elemento clicável
                while (clickableElement && clickableElement !== document.body) {
                    const style = window.getComputedStyle(clickableElement);
                    if (style.cursor === 'pointer' || 
                        clickableElement.tagName === 'BUTTON' || 
                        clickableElement.tagName === 'DIV' && clickableElement.onclick ||
                        clickableElement.hasAttribute('onclick') ||
                        clickableElement.classList.contains('choice') ||
                        clickableElement.classList.contains('answer')) {
                        break;
                    }
                    clickableElement = clickableElement.parentElement;
                }
                
                if (clickableElement && clickableElement !== document.body) {
                    clickableElement.click();
                    showToast("✅ Resposta correta selecionada automaticamente", "success", 1500);
                    foundCorrect = true;
                    break;
                } else {
                    // Fallback: clica no próprio elemento
                    element.click();
                    showToast("✅ Resposta correta selecionada", "success", 1500);
                    foundCorrect = true;
                    break;
                }
            }
        }
        
        return foundCorrect;
    }

    // Observador de mudanças na página para detectar novas questões
    let questionObserver = null;

    function startQuestionObserver() {
        if (questionObserver) return;
        
        questionObserver = new MutationObserver((mutations) => {
            if (features.autoAnswer) {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Verifica se é uma questão nova
                            if (node.textContent && (
                                node.textContent.includes('Correto') ||
                                node.textContent.includes('✅') ||
                                node.querySelector && node.querySelector('[data-testid*="choice"]')
                            )) {
                                setTimeout(() => {
                                    if (findAndClickCorrect()) {
                                        // Aguarda e tenta verificar a resposta
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

    // Loop de resposta automática - TOTALMENTE REFEITO
    (async function autoAnswerLoop() {
        while (true) {
            if (features.autoAnswer) {
                // Tenta clicar no "Correto" imediatamente
                if (findAndClickCorrect()) {
                    // Aguarda um pouco e tenta verificar
                    await delay(1200);
                    
                    // Procura botão de verificar
                    const checkButtons = [
                        '[data-testid="exercise-check-answer"]',
                        'button:contains("Verificar")',
                        'button:contains("Check")',
                        'button:contains("Submit")',
                        '.check-answer',
                        '.submit-answer'
                    ];
                    
                    for (const selector of checkButtons) {
                        try {
                            const buttons = document.querySelectorAll('button');
                            for (const button of buttons) {
                                if (button.textContent && (
                                    button.textContent.includes('Verificar') ||
                                    button.textContent.includes('Check') ||
                                    button.textContent.includes('Submit')
                                )) {
                                    button.click();
                                    showToast("🔍 Verificando resposta...", "info", 1000);
                                    break;
                                }
                            }
                        } catch (e) {}
                    }
                    
                    // Aguarda mais um pouco e tenta ir para próxima
                    await delay(1500);
                    
                    const nextButtons = [
                        '[data-testid="exercise-next-question"]',
                        'button:contains("Próxima")',
                        'button:contains("Next")',
                        'button:contains("Continuar")'
                    ];
                    
                    for (const selector of nextButtons) {
                        try {
                            const buttons = document.querySelectorAll('button');
                            for (const button of buttons) {
                                if (button.textContent && (
                                    button.textContent.includes('Próxima') ||
                                    button.textContent.includes('Next') ||
                                    button.textContent.includes('Continuar')
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
        // Cria efeito Matrix Rain
        function createMatrixRain() {
            const matrixContainer = document.createElement('div');
            matrixContainer.className = 'matrix-rain';
            
            const chars = '01010101010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&';
            const container = document.createElement('div');
            
            for (let i = 0; i < 50; i++) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + 'vw';
                char.style.animationDelay = Math.random() * 5 + 's';
                char.style.animationDuration = (2 + Math.random() * 3) + 's';
                container.appendChild(char);
            }
            
            matrixContainer.appendChild(container);
            return matrixContainer;
        }

        // Cria o splash screen
        const splash = document.createElement("div");
        splash.className = "eclipse-splash";
        splash.appendChild(createMatrixRain());
        splash.innerHTML += `
            <div class="eclipse-splash-content">
                <div class="eclipse-splash-title">PLATFORM DESTROYER</div>
                <div class="eclipse-splash-subtitle">LOADING SYSTEM</div>
                <div class="eclipse-splash-loader">
                    <div class="eclipse-splash-loader-core"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                </div>
                <div class="eclipse-splash-status">
                    <div class="eclipse-splash-status-dot"></div>
                    <div>SYSTEM INITIALIZED</div>
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

        // CRIA O BOTÃO DE MENU
        const toggleBtn = document.createElement("div");
        toggleBtn.className = "eclipse-toggle float";
        toggleBtn.innerHTML = "⚡";
        toggleBtn.setAttribute('data-dragging', 'false');

        // Sistema de arrastar para mobile e desktop
        let isToggleDragging = false;
        let toggleStartX, toggleStartY, toggleStartLeft, toggleStartTop;

        // Eventos de toque para mobile
        toggleBtn.addEventListener('touchstart', (e) => {
            isToggleDragging = true;
            const touch = e.touches[0];
            toggleStartX = touch.clientX;
            toggleStartY = touch.clientY;
            const rect = toggleBtn.getBoundingClientRect();
            toggleStartLeft = rect.left;
            toggleStartTop = rect.top;
            toggleBtn.style.transition = 'none';
            toggleBtn.setAttribute('data-dragging', 'true');
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isToggleDragging) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - toggleStartX;
            const deltaY = touch.clientY - toggleStartY;
            
            const newLeft = toggleStartLeft + deltaX;
            const newTop = toggleStartTop + deltaY;
            
            const maxX = window.innerWidth - toggleBtn.offsetWidth;
            const maxY = window.innerHeight - toggleBtn.offsetHeight;
            
            toggleBtn.style.left = Math.max(10, Math.min(newLeft, maxX)) + 'px';
            toggleBtn.style.top = Math.max(10, Math.min(newTop, maxY)) + 'px';
            toggleBtn.style.right = 'auto';
            toggleBtn.style.bottom = 'auto';
            e.preventDefault();
        });

        document.addEventListener('touchend', () => {
            if (isToggleDragging) {
                isToggleDragging = false;
                toggleBtn.style.transition = 'all 0.3s ease';
                toggleBtn.setAttribute('data-dragging', 'false');
                toggleBtn.classList.add('float');
            }
        });

        // Eventos de mouse para desktop (mantidos do código anterior)
        toggleBtn.addEventListener('mousedown', (e) => {
            isToggleDragging = true;
            toggleStartX = e.clientX;
            toggleStartY = e.clientY;
            const rect = toggleBtn.getBoundingClientRect();
            toggleStartLeft = rect.left;
            toggleStartTop = rect.top;
            toggleBtn.style.transition = 'none';
            toggleBtn.setAttribute('data-dragging', 'true');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isToggleDragging) return;
            const deltaX = e.clientX - toggleStartX;
            const deltaY = e.clientY - toggleStartY;
            
            const newLeft = toggleStartLeft + deltaX;
            const newTop = toggleStartTop + deltaY;
            
            const maxX = window.innerWidth - toggleBtn.offsetWidth;
            const maxY = window.innerHeight - toggleBtn.offsetHeight;
            
            toggleBtn.style.left = Math.max(10, Math.min(newLeft, maxX)) + 'px';
            toggleBtn.style.top = Math.max(10, Math.min(newTop, maxY)) + 'px';
            toggleBtn.style.right = 'auto';
            toggleBtn.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isToggleDragging) {
                isToggleDragging = false;
                toggleBtn.style.transition = 'all 0.3s ease';
                toggleBtn.setAttribute('data-dragging', 'false');
                toggleBtn.classList.add('float');
            }
        });
        
        toggleBtn.onclick = (e) => {
            if (toggleBtn.getAttribute('data-dragging') === 'false') {
                const p = document.getElementById("eclipse-panel");
                if (p) {
                    if (p.style.display === "block") {
                        p.style.display = "none";
                        toggleBtn.classList.remove('active');
                    } else {
                        p.style.display = "block";
                        setTimeout(() => {
                            p.classList.add("active");
                            toggleBtn.classList.add('active');
                        }, 10);
                    }
                }
            }
        };
        
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
                        <div class="eclipse-range-marks">
                            <div class="eclipse-range-mark ${config.autoAnswerDelay <= 1.5 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 1.5 && config.autoAnswerDelay <= 2.0 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 2.0 && config.autoAnswerDelay <= 2.5 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 2.5 ? 'active' : ''}"></div>
                        </div>
                        <div class="eclipse-range-labels">
                            <div>Rápido</div>
                            <div>Normal</div>
                            <div>Lento</div>
                        </div>
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
                            <div>Design futurista com efeitos visuais impressionantes</div>
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

        // Sistema de arrastar para o painel (mobile e desktop)
        let isPanelDragging = false;
        let panelStartX, panelStartY, panelStartLeft, panelStartTop;

        // Touch events para mobile
        panel.addEventListener('touchstart', (e) => {
            if (e.target.closest('button, input, a, .eclipse-tab, .eclipse-range')) return;
            isPanelDragging = true;
            const touch = e.touches[0];
            panelStartX = touch.clientX;
            panelStartY = touch.clientY;
            const rect = panel.getBoundingClientRect();
            panelStartLeft = rect.left;
            panelStartTop = rect.top;
            panel.style.transition = 'none';
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isPanelDragging) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - panelStartX;
            const deltaY = touch.clientY - panelStartY;
            
            const newLeft = panelStartLeft + deltaX;
            const newTop = panelStartTop + deltaY;
            
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            
            panel.style.left = Math.max(10, Math.min(newLeft, maxX)) + 'px';
            panel.style.top = Math.max(10, Math.min(newTop, maxY)) + 'px';
            panel.style.right = 'auto';
            e.preventDefault();
        });

        document.addEventListener('touchend', () => {
            isPanelDragging = false;
            panel.style.transition = 'all 0.3s ease';
        });

        // Mouse events para desktop (mantidos)
        panel.addEventListener('mousedown', (e) => {
            if (e.target.closest('button, input, a, .eclipse-tab, .eclipse-range')) return;
            isPanelDragging = true;
            panelStartX = e.clientX;
            panelStartY = e.clientY;
            const rect = panel.getBoundingClientRect();
            panelStartLeft = rect.left;
            panelStartTop = rect.top;
            panel.style.transition = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isPanelDragging) return;
            const deltaX = e.clientX - panelStartX;
            const deltaY = e.clientY - panelStartY;
            
            const newLeft = panelStartLeft + deltaX;
            const newTop = panelStartTop + deltaY;
            
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            
            panel.style.left = Math.max(10, Math.min(newLeft, maxX)) + 'px';
            panel.style.top = Math.max(10, Math.min(newTop, maxY)) + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isPanelDragging = false;
            panel.style.transition = 'all 0.3s ease';
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
                        // Tenta clicar imediatamente ao ativar
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
        setupToggleButton('eclipse-btn-rgb', 'rgbLogo', toggleRgbLogo);

        // Configura o controle de velocidade
        const speedInput = document.getElementById('eclipse-speed');
        const speedValue = document.querySelector('.eclipse-speed-value');
        const rangeTrack = document.querySelector('.eclipse-range-track');
        const rangeMarks = document.querySelectorAll('.eclipse-range-mark');
        
        if (speedInput && speedValue && rangeTrack) {
            const updateSpeedUI = () => {
                const value = parseFloat(speedInput.value);
                const percent = ((value - 1.0) / 2.0) * 100;
                speedValue.textContent = `${value.toFixed(1)}s`;
                rangeTrack.style.width = `${percent}%`;
                rangeMarks.forEach((mark, index) => {
                    const markValue = 1.0 + (index * 0.5);
                    mark.classList.toggle('active', value >= markValue);
                });
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

        function toggleRgbLogo(isActive) {
            const khanLogo = document.querySelector('path[fill="#14bf96"]');
            if (!khanLogo) return;
            khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
        }
        
        // Inicia o game loop
        gameLoop();
    })();
})();