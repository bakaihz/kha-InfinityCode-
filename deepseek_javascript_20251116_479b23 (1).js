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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        :root {
            --eclipse-bg: #1a1b26;
            --eclipse-surface: #242532;
            --eclipse-border: #3a3b4b;
            --eclipse-primary: #7257ff;
            --eclipse-primary-light: #8a72ff;
            --eclipse-accent: #43d9ad;
            --eclipse-text: #e6e6ff;
            --eclipse-text-muted: #a0a0c0;
            --eclipse-success: #43d9ad;
            --eclipse-error: #ff6b6b;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(114, 87, 255, 0.4); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(114, 87, 255, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(114, 87, 255, 0); }
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
        
        /* Tela de Carregamento Melhorada */
        .eclipse-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0c15, #161827, #1a1b26);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            color: white;
            font-family: 'Inter', sans-serif;
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
                radial-gradient(circle at 20% 30%, rgba(114, 87, 255, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(67, 217, 173, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 40% 80%, rgba(255, 107, 107, 0.05) 0%, transparent 30%);
            z-index: 0;
            animation: gradientShift 8s ease-in-out infinite;
        }

        .eclipse-splash::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(2px 2px at 40px 60px, rgba(90, 90, 122, 0.3) 1px, transparent 1px),
                radial-gradient(2px 2px at 80px 120px, rgba(90, 90, 122, 0.2) 1px, transparent 1px),
                radial-gradient(1px 1px at 160px 80px, rgba(90, 90, 122, 0.4) 1px, transparent 1px);
            background-size: 200px 200px, 300px 300px, 400px 400px;
            opacity: 0.4;
            z-index: 1;
            animation: starsFloat 20s linear infinite;
        }

        .eclipse-splash-content {
            position: relative;
            z-index: 2;
            text-align: center;
            transform: translateY(0);
            animation: contentFloat 3s ease-in-out infinite;
        }

        .eclipse-splash-title {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #7257ff 0%, #43d9ad 50%, #ff6b6b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            background-size: 200% 200%;
            animation: gradientFlow 3s ease-in-out infinite;
            letter-spacing: -0.5px;
        }

        .eclipse-splash-subtitle {
            font-size: 16px;
            color: var(--eclipse-text-muted);
            margin-bottom: 40px;
            font-weight: 400;
            letter-spacing: 0.5px;
            opacity: 0.9;
        }

        .eclipse-splash-loader {
            width: 80px;
            height: 80px;
            position: relative;
            margin-bottom: 30px;
        }

        .eclipse-splash-loader-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background: var(--eclipse-primary);
            border-radius: 50%;
            z-index: 3;
            animation: corePulse 2s ease-in-out infinite;
        }

        .eclipse-splash-loader-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-radius: 50%;
            animation: orbit 2s linear infinite;
        }

        .eclipse-splash-loader-ring:nth-child(1) {
            border-top-color: var(--eclipse-primary);
            animation-duration: 1.5s;
        }

        .eclipse-splash-loader-ring:nth-child(2) {
            border-right-color: var(--eclipse-accent);
            animation-duration: 2s;
            animation-direction: reverse;
        }

        .eclipse-splash-loader-ring:nth-child(3) {
            border-bottom-color: rgba(255, 107, 107, 0.8);
            animation-duration: 2.5s;
        }

        .eclipse-splash-status {
            margin-top: 30px;
            font-size: 14px;
            color: var(--eclipse-text-muted);
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(36, 37, 50, 0.6);
            padding: 8px 16px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(58, 59, 75, 0.3);
        }

        .eclipse-splash-status-dot {
            width: 8px;
            height: 8px;
            background: var(--eclipse-primary);
            border-radius: 50%;
            animation: statusPulse 1.5s ease-in-out infinite;
        }

        .eclipse-splash.fadeout {
            animation: smoothFadeOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Botão de Menu Melhorado */
        .eclipse-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, var(--eclipse-primary), var(--eclipse-primary-light));
            border-radius: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100000;
            color: white;
            font-size: 32px;
            box-shadow: 
                0 8px 32px rgba(114, 87, 255, 0.4),
                0 2px 8px rgba(114, 87, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            font-family: 'Inter', sans-serif;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            transform: scale(1);
        }

        .eclipse-toggle::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
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
                rgba(255, 255, 255, 0.1),
                transparent 30%
            );
            animation: rotate 4s linear infinite;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .eclipse-toggle:hover {
            transform: scale(1.12) translateY(-5px);
            box-shadow: 
                0 15px 40px rgba(114, 87, 255, 0.5),
                0 4px 15px rgba(114, 87, 255, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .eclipse-toggle:hover::before {
            opacity: 1;
        }

        .eclipse-toggle:hover::after {
            opacity: 0.6;
        }

        .eclipse-toggle:active {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 
                0 6px 20px rgba(114, 87, 255, 0.4),
                0 2px 6px rgba(114, 87, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transition: all 0.1s ease;
        }

        .eclipse-toggle.bounce {
            animation: gentleBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .eclipse-toggle.float {
            animation: smoothFloat 3s ease-in-out infinite;
        }

        .eclipse-toggle.active {
            background: linear-gradient(135deg, var(--eclipse-accent), #39c29d);
            box-shadow: 
                0 8px 32px rgba(67, 217, 173, 0.4),
                0 2px 8px rgba(67, 217, 173, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* Novas Animações */
        @keyframes gradientShift {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.8;
            }
        }

        @keyframes starsFloat {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            100% {
                transform: translateY(-100px) rotate(180deg);
            }
        }

        @keyframes contentFloat {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-8px);
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
                box-shadow: 0 0 0 0 rgba(114, 87, 255, 0.4);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.2);
                box-shadow: 0 0 0 10px rgba(114, 87, 255, 0.2);
            }
        }

        @keyframes statusPulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.3);
                opacity: 0.7;
            }
        }

        @keyframes smoothFadeOut {
            to {
                opacity: 0;
                transform: scale(1.1);
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
                transform: scale(1.1) translateY(-8px);
            }
            53% {
                transform: scale(1.05) translateY(-4px);
            }
            80% {
                transform: scale(1.08) translateY(-2px);
            }
            100% {
                transform: scale(1) translateY(0);
            }
        }

        @keyframes smoothFloat {
            0%, 100% {
                transform: translateY(0) rotate(0deg);
            }
            33% {
                transform: translateY(-6px) rotate(1deg);
            }
            66% {
                transform: translateY(-3px) rotate(-1deg);
            }
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
            background: linear-gradient(to right, white, #c5c5ff);
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
            background: rgba(58, 59, 75, 0.5);
            padding: 3px 8px;
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
            padding: 16px;
            display: none;
            max-height: 480px;
            overflow-y: auto;
        }
        
        .eclipse-tab-content.active {
            display: block;
            animation: fadeIn 0.2s ease;
        }
        
        /* Custom scrollbar */
        .eclipse-tab-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .eclipse-tab-content::-webkit-scrollbar-track {
            background: rgba(58, 59, 75, 0.3);
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
        
        .eclipse-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(114, 87, 255, 0.1), transparent);
            transition: all 0.6s ease;
        }
        
        .eclipse-button:hover::before {
            left: 100%;
        }
        
        .eclipse-button:hover {
            border-color: var(--eclipse-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(114, 87, 255, 0.1);
        }
        
        .eclipse-button:active {
            transform: translateY(0);
        }
        
        .eclipse-button.active {
            background: rgba(114, 87, 255, 0.15);
            border-color: var(--eclipse-primary);
            color: white;
        }
        
        .eclipse-button.active::after {
            content: 'ATIVADO';
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(114, 87, 255, 0.25);
            color: var(--eclipse-primary-light);
            font-size: 12px;
            padding: 3px 10px;
            border-radius: 12px;
            font-weight: 600;
        }
        
        .eclipse-icon {
            width: 26px;
            height: 26px;
            min-width: 26px;
            background: rgba(58, 59, 75, 0.3);
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
        
        /* Nova barra de velocidade - bonita, profissional e funcional */
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
            z-index: 2;
        }
        
        .eclipse-range::-webkit-slider-thumb:hover,
        .eclipse-range::-webkit-slider-thumb:active {
            transform: scale(1.25);
            background: var(--eclipse-primary);
            border-color: white;
            box-shadow: 0 0 0 8px rgba(114, 87, 255, 0.2);
        }
        
        .eclipse-range-track {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(90deg, var(--eclipse-primary), var(--eclipse-accent));
        }
        
        .eclipse-range-marks {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 12px;
            pointer-events: none;
        }
        
        .eclipse-range-mark {
            width: 2px;
            height: 8px;
            background: var(--eclipse-text-muted);
            border-radius: 1px;
        }
        
        .eclipse-range-mark.active {
            height: 12px;
            background: var(--eclipse-primary);
        }
        
        .eclipse-range-labels {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 28px;
            font-size: 12px;
            color: var(--eclipse-text-muted);
            pointer-events: none;
        }
        
        .eclipse-footer {
            padding: 16px;
            border-top: 1px solid var(--eclipse-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--eclipse-text-muted);
            background: rgba(36, 37, 50, 0.7);
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
        
        @media (max-width: 400px) {
            .eclipse-features {
                grid-template-columns: 1fr;
            }
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
            box-shadow: 0 4px 12px rgba(114, 87, 255, 0.1);
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
            background: rgba(114, 87, 255, 0.1);
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
        
        .eclipse-credits a:hover {
            text-decoration: underline;
        }
        
        /* Mobile specific styles */
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
            }
            
            .eclipse-toast {
                max-width: calc(100vw - 48px);
                bottom: 24px;
                right: 24px;
                left: auto;
            }
            
            .eclipse-tabs {
                margin: 0 12px;
            }
            
            .eclipse-splash-title {
                font-size: 36px;
            }
            
            .eclipse-splash-subtitle {
                font-size: 14px;
            }
            
            .eclipse-splash-loader {
                width: 60px;
                height: 60px;
            }
        }

        @media (max-width: 480px) {
            .eclipse-splash-title {
                font-size: 32px;
            }
            
            .eclipse-splash-subtitle {
                font-size: 13px;
                margin-bottom: 30px;
            }
            
            .eclipse-splash-status {
                font-size: 12px;
                padding: 6px 12px;
            }
            
            .eclipse-toggle {
                width: 60px;
                height: 60px;
                bottom: 20px;
                right: 20px;
                font-size: 26px;
                border-radius: 18px;
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
                        "🚀 Feito por [@bakai](https://github.com/KilluaWq)",
                        "💫 Créditos para [@bakai](https://github.com/KilluaWq)",
                        "🔭 Acesse o GitHub do [@bakai](https://github.com/KilluaWq)",
                        "🌌 Entre no nosso Discord: [Eclipse](https://discord.gg/UBRpk7YJ)",
                        "🌠 Eclipse sempre em frente"
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

    // Loop de resposta automática - CORRIGIDO
    (async function autoAnswerLoop() {
        while (true) {
            if (features.autoAnswer) {
                // Procura por elementos que contenham "Correto", "✅ Correto" ou "Correto" em diferentes variações
                const correctSelectors = [
                    'span:contains("Correto")',
                    'span:contains("✅ Correto")',
                    'div:contains("Correto")',
                    'div:contains("✅ Correto")',
                    'label:contains("Correto")',
                    'label:contains("✅ Correto")',
                    'button:contains("Correto")',
                    'button:contains("✅ Correto")',
                    '[data-testid*="choice"]:contains("Correto")',
                    '[data-testid*="choice"]:contains("✅ Correto")'
                ];

                let correctElement = null;

                // Tenta encontrar o elemento correto usando diferentes seletores
                for (const selector of correctSelectors) {
                    try {
                        // Usando uma abordagem mais ampla para encontrar elementos
                        const elements = document.querySelectorAll('*');
                        for (const element of elements) {
                            if (element.textContent && (
                                element.textContent.includes('Correto') || 
                                element.textContent.includes('✅ Correto')
                            )) {
                                correctElement = element;
                                break;
                            }
                        }
                        if (correctElement) break;
                    } catch (e) {}
                }

                // Se encontrou o elemento "Correto", clica nele
                if (correctElement) {
                    correctElement.click();
                    await delay(500);
                    
                    // Tenta encontrar e clicar no botão de verificar resposta
                    const checkButtons = [
                        '[data-testid="exercise-check-answer"]',
                        'button:contains("Verificar")',
                        'button:contains("Check")',
                        'button:contains("Submit")',
                        '.check-answer-button',
                        '.submit-button'
                    ];
                    
                    for (const selector of checkButtons) {
                        try {
                            const button = document.querySelector(selector);
                            if (button) {
                                button.click();
                                break;
                            }
                        } catch (e) {}
                    }
                    
                    await delay(1000);
                    
                    // Tenta encontrar e clicar no botão de próxima questão
                    const nextButtons = [
                        '[data-testid="exercise-next-question"]',
                        'button:contains("Próxima")',
                        'button:contains("Next")',
                        'button:contains("Continuar")',
                        '.next-button',
                        '.continue-button'
                    ];
                    
                    for (const selector of nextButtons) {
                        try {
                            const button = document.querySelector(selector);
                            if (button) {
                                button.click();
                                break;
                            }
                        } catch (e) {}
                    }
                } else {
                    // Se não encontrou "Correto", tenta clicar na primeira opção como fallback
                    const firstOption = document.querySelector([
                        '[data-testid*="choice"]',
                        '.choice-option',
                        '.answer-option',
                        'input[type="radio"]',
                        'input[type="checkbox"]'
                    ].join(','));
                    
                    if (firstOption) {
                        firstOption.click();
                        await delay(500);
                        
                        // Tenta verificar a resposta mesmo assim
                        const checkButton = document.querySelector('[data-testid="exercise-check-answer"]');
                        if (checkButton) checkButton.click();
                    }
                }
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
                <div class="eclipse-splash-title">Eclipse Lunar</div>
                <div class="eclipse-splash-subtitle">Carregando sistema de automação</div>
                <div class="eclipse-splash-loader">
                    <div class="eclipse-splash-loader-core"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                </div>
                <div class="eclipse-splash-status">
                    <div class="eclipse-splash-status-dot"></div>
                    <div>Sistema inicializado</div>
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

        // Carrega o Dark Reader
        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader').then(() => {
            DarkReader.setFetchMethod(window.fetch);
            if (features.darkMode) DarkReader.enable();
        });

        // Espera um pouco para mostrar que está carregando
        await delay(1800);
        
        // Faz o splash screen desaparecer suavemente
        splash.classList.add("fadeout");
        
        // Espera a animação de fadeout terminar
        await delay(500);

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
        
        // Cria o painel principal
        const panel = document.createElement("div");
        panel.id = "eclipse-panel";
        panel.className = "eclipse-panel";
        panel.innerHTML = `
            <div class="eclipse-header">
                <div class="eclipse-title">
                    <span class="eclipse-title-icon">🌙</span>
                    Eclipse Lunar
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
                    <p>Um sistema avançado de automação e personalização para Khan Academy, projetado para melhorar sua experiência de aprendizado com recursos inteligentes e interface intuitiva.</p>
                    
                    <div class="eclipse-features">
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Automação Inteligente</div>
                            <div>Respostas automáticas com controle de velocidade ajustável</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Segurança Acadêmica</div>
                            <div>Revelação discreta de respostas e modificação de conteúdo</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Personalização Completa</div>
                            <div>Adapte a interface ao seu estilo de aprendizado</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Desempenho Otimizado</div>
                            <div>Funciona suavemente sem afetar a performance</div>
                        </div>
                    </div>
                    
                    <div class="eclipse-social-links">
                        <a href="https://discord.gg/UBRpk7YJ" target="_blank" class="eclipse-social-btn">
                            <span class="eclipse-social-icon">💬</span>
                            <span>Discord</span>
                        </a>
                        <a href="https://github.com/KilluaWq" target="_blank" class="eclipse-social-btn">
                            <span class="eclipse-social-icon">🐙</span>
                            <span>GitHub</span>
                        </a>
                    </div>
                    
                    <div class="eclipse-credits">
                        Desenvolvido com ❤ por <a href="https://github.com/KilluaWq" target="_blank">@bakai</a><br>
                        Eclipse Lunar • Sempre à frente da curva
                    </div>
                </div>
            </div>
            <div class="eclipse-footer">
                <a href="https://discord.gg/UBRpk7YJ" target="_blank">
                    <span>Comunidade Eclipse</span>
                </a>
                <span id="eclipse-fps">✨ ...</span>
            </div>
        `;
        document.body.appendChild(panel);

        // Configura os botões
        const setupToggleButton = (buttonId, featureName, callback) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    features[featureName] = !features[featureName];
                    button.classList.toggle('active', features[featureName]);
                    
                    if (callback) callback(features[featureName]);
                    
                    // Feedback visual
                    const action = features[featureName] ? "ativado" : "desativado";
                    const featureText = button.querySelector('span:last-child').textContent;
                    showToast(`${featureText} ${action}`, 
                             features[featureName] ? "success" : "info");
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
            // Função para atualizar a interface
            const updateSpeedUI = () => {
                const value = parseFloat(speedInput.value);
                const percent = ((value - 1.5) / 1.0) * 100;
                
                // Atualiza o valor exibido
                speedValue.textContent = `${value.toFixed(1)}s`;
                
                // Atualiza a trilha
                rangeTrack.style.width = `${percent}%`;
                
                // Atualiza os marcadores
                rangeMarks.forEach((mark, index) => {
                    const markValue = 1.5 + (index * 0.25);
                    mark.classList.toggle('active', value >= markValue);
                });
            };
            
            // Atualiza imediatamente
            updateSpeedUI();
            
            // Atualiza durante o movimento do slider (input)
            speedInput.addEventListener('input', updateSpeedUI);
            
            // Atualiza quando soltar o slider (change)
            speedInput.addEventListener('change', () => {
                config.autoAnswerDelay = parseFloat(speedInput.value);
                showToast(`Velocidade definida para ${config.autoAnswerDelay.toFixed(1)}s`, "info", 1500);
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

        // Funções de callback
        function toggleRgbLogo(isActive) {
            const khanLogo = document.querySelector('path[fill="#14bf96"]');
            if (!khanLogo) {
                showToast("Logo do Khan Academy não encontrada", "error");
                return;
            }
            khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
        }
        
        // Configura o arrastar do painel
        let isDragging = false;
        let panelOffset = { x: 0, y: 0 };
        let lastDragTime = 0;
        
        function startDragging(e) {
            // Ignora se clicou em um botão ou input
            if (e.target.closest('button, input, a, .eclipse-tab, .eclipse-range')) return;
            
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            
            // Calcula o offset do mouse em relação ao painel
            panelOffset = {
                x: e.clientX - rect.right,
                y: e.clientY - rect.top
            };
            
            panel.style.cursor = "grabbing";
            panel.style.transition = "none";
            toggleBtn.style.transition = "none";
            toggleBtn.classList.remove('float');
            
            // Marca o tempo do início do drag
            lastDragTime = Date.now();
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            // Calcula a nova posição
            const newX = window.innerWidth - e.clientX + panelOffset.x;
            const newY = e.clientY - panelOffset.y;
            
            // Limita a posição para não sair da tela
            const maxX = window.innerWidth - 50;
            const maxY = window.innerHeight - 50;
            
            panel.style.right = Math.min(newX, maxX) + "px";
            panel.style.top = Math.max(80, Math.min(newY, maxY)) + "px";
        }
        
        function stopDragging() {
            isDragging = false;
            panel.style.cursor = "default";
            panel.style.transition = "transform 0.3s ease";
            toggleBtn.style.transition = "all 0.3s ease";
            
            // Adiciona um efeito de bounce quando solta
            const dragDuration = Date.now() - lastDragTime;
            if (dragDuration < 300) { // Se foi um movimento rápido
                toggleBtn.classList.add('bounce');
                setTimeout(() => {
                    toggleBtn.classList.remove('bounce');
                    toggleBtn.classList.add('float');
                }, 500);
            } else {
                toggleBtn.classList.add('float');
            }
        }
        
        // Event listeners para desktop
        panel.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
        
        // Event listeners para touch (mobile)
        panel.addEventListener('touchstart', (e) => {
            // Converte touch para mouse event
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            startDragging(mouseEvent);
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            drag(mouseEvent);
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            stopDragging();
        });
        
        // Inicia o game loop
        gameLoop();
    })();
})();