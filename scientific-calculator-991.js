/* ============================================================
   SCIENTIFIC CALCULATOR 991 PLUS
   JavaScript-only build (vanilla JS, no dependencies)
   ------------------------------------------------------------
   This single file reconstructs the entire calculator UI:
     1. Injects all CSS via a <style> element
     2. Builds the entire DOM via document.body.innerHTML
     3. Initialises all calculator logic and event handlers
   To use: just include this script on any (even empty) HTML page.
        <script src="scientific-calculator-991.js"></script>
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. CSS (injected as a <style> tag) ---------- */
  var CALC991_CSS = "\n  * {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n    -webkit-tap-highlight-color: transparent;\n    -webkit-touch-callout: none;\n  }\n  :root {\n    --bg-app: #0a0e14;\n    --bg-calc: linear-gradient(180deg, #1a1f2a 0%, #0f131a 100%);\n    --bg-display: linear-gradient(180deg, #1e2433 0%, #161b27 100%);\n    --bg-key-dark: linear-gradient(180deg, #2a3140 0%, #1f2530 100%);\n    --bg-key-num: linear-gradient(180deg, #353d4d 0%, #252b38 100%);\n    --bg-key-op: linear-gradient(180deg, #3d5a82 0%, #2a4060 100%);\n    --bg-key-fn: linear-gradient(180deg, #2c3340 0%, #1e2330 100%);\n    --bg-key-eq: linear-gradient(180deg, #f59e2c 0%, #d97e15 100%);\n    --bg-key-ac: linear-gradient(180deg, #e54b3a 0%, #b8311f 100%);\n    --bg-key-del: linear-gradient(180deg, #5a4146 0%, #3a2a2d 100%);\n    --accent: #f5a623;\n    --accent-2: #4fc3f7;\n    --green: #66d96a;\n    --text-light: #e8ecf2;\n    --text-dim: #8b95a8;\n    --text-darker: #5a6478;\n    --display-text: #f0f5ff;\n    --display-result: #66e0a0;\n    --display-error: #ff6b6b;\n    --border-soft: rgba(255,255,255,0.06);\n    --shadow-key: 0 2px 0 rgba(0,0,0,0.5), 0 1px 1px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);\n    --shadow-key-pressed: 0 0 0 rgba(0,0,0,0.4), inset 0 1px 3px rgba(0,0,0,0.4);\n    --safe-top: env(safe-area-inset-top, 0px);\n    --safe-bottom: env(safe-area-inset-bottom, 0px);\n    --safe-left: env(safe-area-inset-left, 0px);\n    --safe-right: env(safe-area-inset-right, 0px);\n  }\n\n  html, body {\n    height: 100%;\n    overflow: hidden;\n    overscroll-behavior: none;\n    touch-action: manipulation;\n  }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Roboto', 'Segoe UI', sans-serif;\n    background: var(--bg-app);\n    color: var(--text-light);\n    user-select: none;\n    -webkit-user-select: none;\n    -webkit-font-smoothing: antialiased;\n    text-rendering: optimizeLegibility;\n  }\n\n  /* ===== App container ===== */\n  .app {\n    height: 100vh;\n    height: 100dvh;\n    display: flex;\n    flex-direction: column;\n    max-width: 480px;\n    margin: 0 auto;\n    background: var(--bg-app);\n    position: relative;\n    padding: var(--safe-top) var(--safe-left) var(--safe-bottom) var(--safe-right);\n  }\n\n  /* ===== Top bar ===== */\n  .top-bar {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 10px 14px 6px;\n    background: rgba(255,255,255,0.02);\n    border-bottom: 1px solid var(--border-soft);\n    min-height: 44px;\n  }\n  .top-bar .brand {\n    display: flex; align-items: center; gap: 8px;\n    font-size: 13px; font-weight: 600;\n    letter-spacing: 0.8px;\n    color: var(--text-light);\n  }\n  .top-bar .brand-icon {\n    width: 22px; height: 22px;\n    border-radius: 5px;\n    background: linear-gradient(135deg, var(--accent), #d97e15);\n    display: flex; align-items: center; justify-content: center;\n    font-size: 11px; font-weight: 800; color: #fff;\n    box-shadow: 0 1px 3px rgba(245,166,35,0.4);\n  }\n  .top-bar .top-actions {\n    display: flex; gap: 6px;\n  }\n  .icon-btn {\n    width: 36px; height: 36px;\n    border: none;\n    border-radius: 8px;\n    background: rgba(255,255,255,0.06);\n    color: var(--text-dim);\n    display: flex; align-items: center; justify-content: center;\n    cursor: pointer;\n    transition: all 0.15s;\n  }\n  .icon-btn:active { background: rgba(255,255,255,0.12); transform: scale(0.95); }\n  .icon-btn.active { background: var(--accent); color: #fff; }\n  .icon-btn svg { width: 18px; height: 18px; fill: currentColor; }\n\n  /* ===== Status bar (indicators) ===== */\n  .status-bar {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 4px 10px;\n    padding: 6px 14px;\n    font-size: 10px;\n    font-weight: 700;\n    color: var(--text-darker);\n    letter-spacing: 0.8px;\n    border-bottom: 1px solid var(--border-soft);\n  }\n  .status-bar .ind {\n    transition: all 0.2s;\n    opacity: 0.4;\n  }\n  .status-bar .ind.on {\n    color: var(--accent);\n    opacity: 1;\n  }\n  .status-bar .ind.ang.on { color: var(--accent-2); }\n  .status-bar .ind.err.on { color: var(--display-error); }\n  .status-bar .sep { color: var(--text-darker); opacity: 0.3; }\n\n  /* ===== Display area ===== */\n  .display-wrap {\n    flex: 1;\n    background: var(--bg-display);\n    margin: 8px 10px 6px;\n    border-radius: 14px;\n    padding: 14px 14px 12px;\n    display: flex;\n    flex-direction: column;\n    min-height: 0;\n    box-shadow: inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03);\n    border: 1px solid rgba(255,255,255,0.04);\n    position: relative;\n    overflow: hidden;\n  }\n  .display-wrap::before {\n    content: '';\n    position: absolute; inset: 0;\n    background: radial-gradient(ellipse at top right, rgba(79,195,247,0.04), transparent 50%);\n    pointer-events: none;\n  }\n  .input-expr {\n    flex: 1;\n    overflow-y: auto;\n    overflow-x: hidden;\n    word-break: break-all;\n    white-space: pre-wrap;\n    font-family: 'SF Mono', 'JetBrains Mono', 'Consolas', monospace;\n    font-size: clamp(18px, 5.5vw, 26px);\n    line-height: 1.35;\n    color: var(--display-text);\n    padding: 2px 0;\n    min-height: 28px;\n    -webkit-overflow-scrolling: touch;\n  }\n  .input-expr::-webkit-scrollbar { display: none; }\n  .cursor {\n    display: inline-block;\n    width: 2px; height: 1em;\n    background: var(--accent-2);\n    vertical-align: middle;\n    margin: 0 1px;\n    animation: blink 1.1s steps(1) infinite;\n  }\n  @keyframes blink { 50% { opacity: 0; } }\n  .result-line {\n    font-family: 'SF Mono', 'JetBrains Mono', 'Consolas', monospace;\n    font-size: clamp(22px, 7vw, 36px);\n    font-weight: 700;\n    text-align: right;\n    color: var(--display-result);\n    word-break: break-all;\n    min-height: 32px;\n    margin-top: 6px;\n    padding-top: 6px;\n    border-top: 1px dashed rgba(255,255,255,0.06);\n    transition: color 0.2s;\n  }\n  .result-line.error { color: var(--display-error); font-size: 0.7em; }\n  .result-line.placeholder { color: var(--text-darker); font-size: 0.6em; font-weight: 400; font-style: italic; }\n  .input-hint {\n    color: var(--text-darker);\n    font-size: 0.55em;\n    font-style: italic;\n    font-family: -apple-system, sans-serif;\n    opacity: 0.5;\n  }\n\n  /* ===== Keypad ===== */\n  .keypad {\n    display: grid;\n    grid-template-columns: repeat(6, 1fr);\n    gap: 5px;\n    padding: 6px 8px 12px;\n    background: var(--bg-calc);\n    border-top: 1px solid var(--border-soft);\n  }\n  .key {\n    position: relative;\n    border: none;\n    border-radius: 10px;\n    padding: 0;\n    font-size: clamp(13px, 3.5vw, 16px);\n    font-weight: 600;\n    color: var(--text-light);\n    background: var(--bg-key-dark);\n    box-shadow: var(--shadow-key);\n    cursor: pointer;\n    transition: transform 0.08s ease-out, box-shadow 0.08s, filter 0.1s;\n    min-height: 48px;\n    font-family: inherit;\n    overflow: hidden;\n    display: flex; align-items: center; justify-content: center;\n    text-align: center;\n  }\n  .key:active, .key.pressed {\n    transform: translateY(2px) scale(0.98);\n    box-shadow: var(--shadow-key-pressed);\n    filter: brightness(1.15);\n  }\n  .key .shift-label {\n    position: absolute; top: 3px; left: 5px;\n    font-size: clamp(7px, 1.8vw, 9px);\n    color: var(--accent);\n    font-weight: 700;\n    letter-spacing: 0.3px;\n  }\n  .key .alpha-label {\n    position: absolute; top: 3px; right: 5px;\n    font-size: clamp(7px, 1.8vw, 9px);\n    color: var(--green);\n    font-weight: 700;\n    letter-spacing: 0.3px;\n  }\n  .key .main {\n    font-size: clamp(13px, 3.6vw, 16px);\n    line-height: 1;\n  }\n  .key.fn { background: var(--bg-key-fn); }\n  .key.fn .main { font-size: clamp(11px, 3vw, 13px); }\n  .key.num { background: var(--bg-key-num); font-size: clamp(18px, 5vw, 22px); }\n  .key.num .main { font-size: clamp(18px, 5vw, 22px); font-weight: 500; }\n  .key.op { background: var(--bg-key-op); }\n  .key.eq {\n    background: var(--bg-key-eq);\n    color: #fff;\n    font-weight: 700;\n    box-shadow: 0 2px 0 #9a5b0e, 0 0 12px rgba(245,166,35,0.25), inset 0 1px 0 rgba(255,255,255,0.15);\n  }\n  .key.ac {\n    background: var(--bg-key-ac);\n    color: #fff;\n    font-weight: 700;\n  }\n  .key.del {\n    background: var(--bg-key-del);\n    color: #ffb3a8;\n  }\n  .key.ctrl { background: var(--bg-key-fn); font-size: clamp(10px, 2.6vw, 12px); }\n  .key.ctrl .main { font-size: clamp(10px, 2.6vw, 12px); font-weight: 700; }\n  .key.active-toggle {\n    background: linear-gradient(180deg, var(--accent), #d97e15) !important;\n    color: #fff !important;\n    box-shadow: 0 2px 0 #9a5b0e, 0 0 10px rgba(245,166,35,0.4);\n  }\n  .key.active-toggle .shift-label, .key.active-toggle .alpha-label { color: rgba(255,255,255,0.85); }\n\n  /* ===== Bottom Sheet (for history/modes/help) ===== */\n  .sheet-backdrop {\n    position: fixed; inset: 0;\n    background: rgba(0,0,0,0.6);\n    backdrop-filter: blur(4px);\n    -webkit-backdrop-filter: blur(4px);\n    z-index: 50;\n    opacity: 0;\n    pointer-events: none;\n    transition: opacity 0.3s;\n  }\n  .sheet-backdrop.show { opacity: 1; pointer-events: auto; }\n\n  .bottom-sheet {\n    position: fixed;\n    left: 0; right: 0; bottom: 0;\n    background: linear-gradient(180deg, #1c2230 0%, #141821 100%);\n    border-radius: 20px 20px 0 0;\n    z-index: 51;\n    transform: translateY(100%);\n    transition: transform 0.32s cubic-bezier(0.32, 0.72, 0.4, 1);\n    max-height: 78vh;\n    display: flex;\n    flex-direction: column;\n    box-shadow: 0 -10px 40px rgba(0,0,0,0.5);\n    padding-bottom: var(--safe-bottom);\n  }\n  .bottom-sheet.show { transform: translateY(0); }\n  .sheet-handle {\n    width: 40px; height: 4px;\n    background: rgba(255,255,255,0.18);\n    border-radius: 2px;\n    margin: 10px auto 6px;\n    flex-shrink: 0;\n  }\n  .sheet-header {\n    display: flex; align-items: center; justify-content: space-between;\n    padding: 4px 16px 10px;\n    border-bottom: 1px solid var(--border-soft);\n  }\n  .sheet-title {\n    font-size: 15px; font-weight: 700;\n    color: var(--text-light);\n  }\n  .sheet-tabs {\n    display: flex;\n    gap: 4px;\n    padding: 8px 12px;\n    border-bottom: 1px solid var(--border-soft);\n  }\n  .sheet-tab {\n    flex: 1;\n    background: transparent;\n    border: none;\n    color: var(--text-dim);\n    padding: 8px 6px;\n    font-size: 11px;\n    font-weight: 600;\n    cursor: pointer;\n    border-bottom: 2px solid transparent;\n    text-transform: uppercase;\n    letter-spacing: 0.6px;\n    transition: all 0.2s;\n  }\n  .sheet-tab.active {\n    color: var(--accent);\n    border-bottom-color: var(--accent);\n  }\n  .sheet-content {\n    flex: 1;\n    overflow-y: auto;\n    -webkit-overflow-scrolling: touch;\n    padding: 10px 14px 16px;\n  }\n  .sheet-content::-webkit-scrollbar { width: 4px; }\n  .sheet-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }\n\n  /* History list */\n  .history-empty {\n    text-align: center;\n    color: var(--text-darker);\n    padding: 40px 16px;\n    font-size: 13px;\n    line-height: 1.5;\n  }\n  .history-empty svg { width: 48px; height: 48px; opacity: 0.3; margin-bottom: 12px; }\n  .history-item {\n    background: rgba(255,255,255,0.04);\n    border-left: 3px solid var(--accent-2);\n    padding: 10px 12px;\n    margin-bottom: 8px;\n    border-radius: 8px;\n    cursor: pointer;\n    transition: all 0.15s;\n  }\n  .history-item:active {\n    background: rgba(255,255,255,0.08);\n    transform: scale(0.98);\n  }\n  .history-item .h-expr {\n    font-family: 'SF Mono', 'JetBrains Mono', monospace;\n    color: var(--text-dim);\n    font-size: 12px;\n    word-break: break-all;\n    margin-bottom: 4px;\n  }\n  .history-item .h-res {\n    font-family: 'SF Mono', 'JetBrains Mono', monospace;\n    color: var(--accent);\n    font-size: 18px;\n    font-weight: 700;\n    word-break: break-all;\n  }\n\n  /* Modes list */\n  .mode-list-title {\n    color: var(--text-dim);\n    font-size: 10px;\n    font-weight: 700;\n    letter-spacing: 1px;\n    text-transform: uppercase;\n    margin: 8px 4px;\n  }\n  .mode-list {\n    display: flex; flex-direction: column;\n    gap: 6px;\n  }\n  .mode-row {\n    background: rgba(255,255,255,0.04);\n    border: 1px solid var(--border-soft);\n    border-radius: 10px;\n    padding: 12px 14px;\n    cursor: pointer;\n    display: flex; align-items: center; gap: 12px;\n    transition: all 0.15s;\n  }\n  .mode-row:active { transform: scale(0.98); }\n  .mode-row.active {\n    background: rgba(245,166,35,0.12);\n    border-color: var(--accent);\n  }\n  .mode-row .m-icon {\n    width: 36px; height: 36px;\n    border-radius: 8px;\n    background: linear-gradient(135deg, rgba(245,166,35,0.15), rgba(245,166,35,0.05));\n    display: flex; align-items: center; justify-content: center;\n    color: var(--accent);\n    font-size: 11px; font-weight: 800;\n    flex-shrink: 0;\n  }\n  .mode-row.active .m-icon {\n    background: linear-gradient(135deg, var(--accent), #d97e15);\n    color: #fff;\n  }\n  .mode-row .m-text { flex: 1; }\n  .mode-row .m-name {\n    color: var(--text-light);\n    font-size: 14px;\n    font-weight: 600;\n  }\n  .mode-row .m-desc {\n    color: var(--text-dim);\n    font-size: 11px;\n    margin-top: 2px;\n  }\n\n  /* Settings section */\n  .setting-group {\n    background: rgba(255,255,255,0.03);\n    border-radius: 10px;\n    padding: 4px 12px;\n    margin-bottom: 12px;\n  }\n  .setting-row {\n    display: flex; align-items: center; justify-content: space-between;\n    padding: 12px 0;\n    border-bottom: 1px solid var(--border-soft);\n  }\n  .setting-row:last-child { border-bottom: none; }\n  .setting-label { color: var(--text-light); font-size: 14px; }\n  .setting-value { color: var(--accent); font-size: 13px; font-weight: 600; }\n  .seg-control {\n    display: flex;\n    background: rgba(0,0,0,0.3);\n    border-radius: 8px;\n    padding: 2px;\n    gap: 2px;\n  }\n  .seg-control button {\n    background: transparent;\n    border: none;\n    color: var(--text-dim);\n    padding: 6px 12px;\n    border-radius: 6px;\n    font-size: 11px;\n    font-weight: 600;\n    cursor: pointer;\n    transition: all 0.15s;\n  }\n  .seg-control button.active {\n    background: var(--accent);\n    color: #fff;\n  }\n\n  /* Help content */\n  .help-section { margin-bottom: 16px; }\n  .help-section h4 {\n    color: var(--accent);\n    font-size: 11px;\n    font-weight: 700;\n    letter-spacing: 0.8px;\n    text-transform: uppercase;\n    margin: 10px 4px 8px;\n  }\n  .help-section ul { list-style: none; }\n  .help-section li {\n    color: var(--text-light);\n    font-size: 13px;\n    padding: 6px 0 6px 18px;\n    position: relative;\n    line-height: 1.5;\n    border-bottom: 1px solid var(--border-soft);\n  }\n  .help-section li::before {\n    content: '\u25b8';\n    color: var(--accent);\n    position: absolute;\n    left: 4px;\n  }\n  .help-section code {\n    background: rgba(245,166,35,0.12);\n    color: var(--accent);\n    padding: 1px 6px;\n    border-radius: 4px;\n    font-family: 'SF Mono', monospace;\n    font-size: 12px;\n  }\n\n  /* ===== Overlay for advanced modes ===== */\n  .overlay {\n    position: fixed; inset: 0;\n    background: rgba(0,0,0,0.7);\n    backdrop-filter: blur(6px);\n    -webkit-backdrop-filter: blur(6px);\n    z-index: 100;\n    display: none;\n    align-items: flex-end; justify-content: center;\n    padding: 16px;\n  }\n  .overlay.show { display: flex; }\n  .overlay-box {\n    background: linear-gradient(180deg, #1c2230 0%, #141821 100%);\n    border-radius: 16px 16px 0 0;\n    padding: 16px 16px calc(20px + var(--safe-bottom));\n    width: 100%; max-width: 460px;\n    max-height: 80vh;\n    overflow-y: auto;\n    color: var(--text-light);\n    box-shadow: 0 -10px 40px rgba(0,0,0,0.5);\n  }\n  .overlay-box h3 {\n    color: var(--accent);\n    font-size: 15px;\n    font-weight: 700;\n    margin-bottom: 12px;\n    letter-spacing: 0.5px;\n  }\n  .overlay-box .ov-row {\n    display: flex; gap: 8px; margin: 8px 0; flex-wrap: wrap;\n  }\n  .overlay-box input, .overlay-box select, .overlay-box textarea {\n    background: rgba(0,0,0,0.3);\n    border: 1px solid var(--border-soft);\n    color: var(--accent);\n    padding: 10px 12px;\n    border-radius: 8px;\n    font-family: 'SF Mono', monospace;\n    font-size: 14px;\n    flex: 1; min-width: 60px;\n    outline: none;\n    -webkit-appearance: none;\n  }\n  .overlay-box input:focus, .overlay-box select:focus, .overlay-box textarea:focus {\n    border-color: var(--accent);\n  }\n  .overlay-box textarea { resize: vertical; min-height: 80px; }\n  .ov-btn {\n    background: linear-gradient(180deg, var(--accent), #d97e15);\n    border: none; color: #fff;\n    padding: 10px 16px; border-radius: 8px;\n    cursor: pointer; font-weight: 700;\n    font-size: 13px;\n    box-shadow: 0 2px 0 #9a5b0e;\n  }\n  .ov-btn:active { transform: translateY(1px); }\n  .ov-btn.ghost {\n    background: rgba(255,255,255,0.08);\n    color: var(--text-light);\n    box-shadow: none;\n  }\n  .ov-result {\n    margin-top: 12px;\n    background: rgba(0,0,0,0.3);\n    padding: 12px;\n    border-radius: 8px;\n    border: 1px solid var(--border-soft);\n    font-family: 'SF Mono', monospace;\n    font-size: 13px;\n    color: var(--display-result);\n    white-space: pre-wrap;\n    word-break: break-all;\n    max-height: 240px;\n    overflow-y: auto;\n    line-height: 1.5;\n  }\n  .ov-section {\n    color: var(--text-dim);\n    font-size: 11px;\n    font-weight: 700;\n    letter-spacing: 1px;\n    text-transform: uppercase;\n    margin: 16px 0 6px;\n    padding-top: 12px;\n    border-top: 1px solid var(--border-soft);\n  }\n  .ov-section:first-of-type { border-top: none; padding-top: 0; margin-top: 4px; }\n\n  /* ===== Toast notification ===== */\n  .toast {\n    position: fixed;\n    top: calc(60px + var(--safe-top));\n    left: 50%;\n    transform: translateX(-50%) translateY(-20px);\n    background: rgba(20,24,33,0.96);\n    color: var(--text-light);\n    padding: 8px 16px;\n    border-radius: 20px;\n    font-size: 12px;\n    font-weight: 600;\n    box-shadow: 0 4px 20px rgba(0,0,0,0.5);\n    border: 1px solid rgba(245,166,35,0.3);\n    z-index: 200;\n    opacity: 0;\n    pointer-events: none;\n    transition: all 0.3s;\n    max-width: 80vw;\n    text-align: center;\n  }\n  .toast.show {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0);\n  }\n\n  /* ===== Long-press hint ===== */\n  .long-hint {\n    position: absolute;\n    background: rgba(0,0,0,0.92);\n    color: var(--accent);\n    padding: 6px 10px;\n    border-radius: 6px;\n    font-size: 11px;\n    font-weight: 600;\n    pointer-events: none;\n    z-index: 60;\n    white-space: nowrap;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.5);\n    opacity: 0;\n    transition: opacity 0.15s;\n  }\n  .long-hint.show { opacity: 1; }\n\n  /* ===== Loading splash ===== */\n  .splash {\n    position: fixed; inset: 0;\n    background: var(--bg-app);\n    z-index: 999;\n    display: flex; align-items: center; justify-content: center;\n    flex-direction: column; gap: 16px;\n    transition: opacity 0.4s;\n  }\n  .splash.hide { opacity: 0; pointer-events: none; }\n  .splash-icon {\n    width: 64px; height: 64px;\n    border-radius: 14px;\n    background: linear-gradient(135deg, var(--accent), #d97e15);\n    display: flex; align-items: center; justify-content: center;\n    font-size: 28px; font-weight: 800; color: #fff;\n    box-shadow: 0 8px 24px rgba(245,166,35,0.4);\n    animation: pulse 1.4s ease-in-out infinite;\n  }\n  @keyframes pulse {\n    0%, 100% { transform: scale(1); }\n    50% { transform: scale(1.06); }\n  }\n  .splash-text {\n    color: var(--text-dim);\n    font-size: 12px;\n    letter-spacing: 1px;\n  }\n\n  /* ===== Larger screens ===== */\n  @media (min-width: 600px) {\n    .app {\n      max-width: 480px;\n      border-left: 1px solid var(--border-soft);\n      border-right: 1px solid var(--border-soft);\n      box-shadow: 0 0 40px rgba(0,0,0,0.5);\n    }\n  }\n\n  /* ===== Landscape: compact layout ===== */\n  @media (orientation: landscape) and (max-height: 480px) {\n    .keypad { padding: 4px 8px 6px; gap: 3px; }\n    .key { min-height: 36px; }\n    .display-wrap { margin: 4px 8px 4px; padding: 6px 10px; min-height: 0; }\n    .input-expr { font-size: 14px; }\n    .result-line { font-size: 20px; }\n    .top-bar { padding: 4px 12px; min-height: 36px; }\n    .status-bar { padding: 2px 14px; }\n  }\n\n\n  /* ===== fx-991MS-inspired compact keypad skin ===== */\n  :root {\n    --bg-app: #101116;\n    --bg-calc: #17171c;\n    --bg-display: #d8e4e5;\n    --bg-key-dark: linear-gradient(180deg,#45434a 0%,#29282e 100%);\n    --bg-key-num: linear-gradient(180deg,#35363b 0%,#202126 100%);\n    --bg-key-op: linear-gradient(180deg,#46434a 0%,#2b2930 100%);\n    --bg-key-fn: linear-gradient(180deg,#514e55 0%,#302e34 100%);\n    --bg-key-eq: linear-gradient(180deg,#f39a51 0%,#e47a35 100%);\n    --bg-key-ac: linear-gradient(180deg,#f39a51 0%,#e47a35 100%);\n    --bg-key-del: linear-gradient(180deg,#f39a51 0%,#e47a35 100%);\n    --accent: #ffd400;\n    --accent-2: #9bc8ff;\n    --green: #c9a5ff;\n    --text-light: #f4f2f5;\n    --text-dim: #c5c2c9;\n    --text-darker: #9a969f;\n    --display-text: #263b8c;\n    --display-result: #263b8c;\n    --display-error: #a52c2c;\n    --border-soft: rgba(255,255,255,.08);\n    --shadow-key: 0 2px 0 rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.16);\n    --shadow-key-pressed: inset 0 2px 4px rgba(0,0,0,.55);\n  }\n  .app { max-width: 480px; background:#111116; gap:0; }\n  .top-bar {\n    min-height:34px; height:34px; flex:0 0 34px; padding:3px 9px;\n    background:#17171b; border-bottom:1px solid #303038;\n  }\n  .top-bar .brand { gap:6px; font-size:10px; letter-spacing:.3px; }\n  .top-bar .brand-icon {\n    width:20px;height:20px;border-radius:4px;background:#25252d;\n    border:1px solid #77717f;color:#d9c8ff;box-shadow:none;font-size:9px;\n  }\n  .top-bar .top-actions { gap:3px; }\n  .icon-btn { width:27px;height:27px;border-radius:50%;background:#25252b;color:#e6e3e8; }\n  .status-bar {\n    min-height:22px; flex:0 0 22px; padding:3px 9px; gap:4px 8px;\n    background:#17171b; border:0; color:#b9b5bf; font-size:9px; letter-spacing:.45px;\n  }\n  .status-bar .ind { opacity:.9; }\n  .display-wrap {\n    flex:0 0 25vh; min-height:145px; max-height:245px;\n    margin:5px 4px 5px; padding:10px 12px 8px; border-radius:9px;\n    background:#d8e4e5; border:1px solid #aababb;\n    box-shadow:inset 0 1px 2px rgba(30,45,55,.16); color:#263b8c;\n  }\n  .display-wrap::before { display:none; }\n  .input-expr {\n    color:#263b8c; font-family:Arial, sans-serif;\n    font-size:clamp(20px,5.5vw,27px); line-height:1.3;\n  }\n  .result-line {\n    color:#263b8c; border:0; margin-top:4px; padding-top:4px;\n    font-family:Arial,sans-serif; font-size:clamp(22px,6vw,30px); font-weight:500;\n  }\n  .result-line.placeholder { color:#66758c; }\n  .keypad {\n    flex:1; min-height:0; grid-template-columns:repeat(6,minmax(0,1fr));\n    grid-auto-rows:minmax(0,1fr); gap:4px; padding:5px 3px 7px;\n    background:#17171c; border-top:0;\n  }\n  .key {\n    min-height:0; height:100%; border-radius:8px; border:1px solid #55525a;\n    font-size:clamp(12px,3.4vw,16px); font-weight:500;\n    background:linear-gradient(180deg,#514e55 0%,#302e34 100%);\n    box-shadow:0 2px 0 #111, inset 0 1px 0 rgba(255,255,255,.13);\n  }\n  .key .main { font-size:clamp(13px,3.7vw,17px); }\n  .key.fn,.key.ctrl { background:linear-gradient(180deg,#514e55 0%,#302e34 100%); }\n  .key.fn .main { font-size:clamp(11px,3.2vw,15px); }\n  .key.num { background:linear-gradient(180deg,#383940 0%,#202126 100%); }\n  .key.num .main { font-size:clamp(19px,5vw,24px); }\n  .key.op { background:linear-gradient(180deg,#514e55 0%,#302e34 100%); }\n  .key.eq,.key.ac,.key.del {\n    color:#17171b; background:linear-gradient(180deg,#f39a51 0%,#e47a35 100%);\n    border-color:#f2a46d; box-shadow:0 2px 0 #8b4826,inset 0 1px 0 rgba(255,255,255,.3);\n  }\n  .key .shift-label { top:auto; bottom:2px; left:3px; font-size:clamp(6px,1.65vw,8px); color:#ffe000; }\n  .key .alpha-label { top:auto; bottom:2px; right:3px; font-size:clamp(6px,1.65vw,8px); color:#c7a5ff; }\n  .key.active-toggle { background:linear-gradient(180deg,#ffd84a,#e8a900)!important;color:#171717!important; }\n  @media (min-width:600px) { .app { max-width:480px; } }\n  @media (orientation:landscape) and (max-height:480px) {\n    .display-wrap { flex-basis:22vh; min-height:90px; }\n    .keypad { gap:3px; padding:3px; }\n  }\n\n\n\n/* ===== Professional 991 interface refresh ===== */\n:root {\n  --bg-app: #0b1020;\n  --bg-calc: #101729;\n  --text-light: #f3f5fb;\n  --text-dim: #9aa7bd;\n  --text-darker: #77839a;\n  --accent: #f4b544;\n  --accent-2: #72b7f2;\n  --green: #b99aff;\n  --display-text: #18243a;\n  --display-result: #18243a;\n  --display-error: #b42336;\n}\nhtml, body { background:#0b1020; }\nbody { background:radial-gradient(ellipse at 50% -15%, #263653 0%, #10182a 42%, #090e19 100%); }\n.app {\n  max-width:520px;\n  background:linear-gradient(180deg,#151e31 0%,#0d1423 100%);\n  box-shadow:0 0 0 1px rgba(255,255,255,.07), 0 24px 80px rgba(0,0,0,.42);\n}\n.top-bar {\n  min-height:52px; flex:0 0 52px; padding:0 16px;\n  background:rgba(13,20,35,.96); border-bottom:1px solid rgba(255,255,255,.08);\n}\n.top-bar .brand { font-size:12px; letter-spacing:1.15px; font-weight:750; color:#f5f7fc; gap:10px; }\n.top-bar .brand-icon {\n  width:27px;height:27px;border-radius:8px;background:linear-gradient(145deg,#f5c56c,#c58a2d);\n  color:#172033;border:0;font-size:11px;font-weight:900;box-shadow:0 3px 10px #d99b3540;\n}\n.top-bar .top-actions { gap:7px; }\n.icon-btn { width:32px;height:32px;border-radius:9px;background:#202c42;color:#c7d1e2;border:1px solid #34435c; }\n.icon-btn.active { background:#d9a342;color:#172033;border-color:#e7bd70; }\n.status-bar {\n  min-height:27px; flex:0 0 27px; padding:4px 15px; gap:7px 11px;\n  background:#111a2b; border:0; color:#9caac0; font-size:10px; letter-spacing:.7px;\n}\n.status-bar .ind { opacity:.58; }\n.status-bar .ind.on { color:#f3bd5d; opacity:1; }\n.status-bar .ind.ang.on { color:#79c5ff; }\n.display-wrap {\n  flex:1 1 0; min-height:155px; max-height:270px;\n  margin:12px 12px 10px; padding:16px 17px 13px; border-radius:15px;\n  background:linear-gradient(145deg,#e8eef3 0%,#dce6ed 100%);\n  border:1px solid #ffffff; color:#18243a;\n  box-shadow:inset 0 2px 5px rgba(26,43,64,.09),0 8px 22px rgba(0,0,0,.16);\n}\n.display-wrap::after {\n  content:'991 SCIENTIFIC'; position:absolute; right:15px; top:10px;\n  color:rgba(43,62,87,.34); font:700 8px/1 Arial,sans-serif; letter-spacing:1.2px;\n  pointer-events:none;\n}\n.display-wrap::before { display:none; }\n.input-expr { color:#172943; font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:clamp(19px,4.9vw,25px); line-height:1.42; }\n.cursor { background:#3276bd; }\n.result-line {\n  color:#142844; border-top:1px solid rgba(36,57,82,.14); margin-top:10px; padding-top:10px;\n  font-family:ui-monospace,SFMono-Regular,Consolas,monospace;\n  font-size:clamp(25px,6vw,34px); font-weight:650; letter-spacing:-.7px;\n}\n.result-line.placeholder { color:#7b8ba0; }\n.keypad {\n  flex:1 1 0; min-height:0; grid-template-columns:repeat(6,minmax(0,1fr));\n  grid-auto-rows:minmax(0,1fr); gap:6px; padding:8px 12px max(12px,env(safe-area-inset-bottom));\n  background:transparent; border-top:1px solid rgba(255,255,255,.07);\n}\n.key {\n  min-height:0; height:100%; border-radius:10px; border:1px solid #46536a;\n  color:#edf2fa; background:linear-gradient(180deg,#39465c 0%,#273247 100%);\n  box-shadow:0 3px 0 #111a2a, inset 0 1px 0 rgba(255,255,255,.12);\n  font-size:clamp(12px,3.25vw,15px); font-weight:600;\n  transition:transform .08s ease,filter .12s ease,box-shadow .12s ease;\n}\n.key:hover { filter:brightness(1.12); }\n.key:active,.key.pressed { transform:translateY(2px); box-shadow:0 1px 0 #111a2a,inset 0 2px 5px rgba(0,0,0,.25); }\n.key .main { font-size:clamp(13px,3.5vw,16px); font-weight:620; }\n.key.fn,.key.ctrl { background:linear-gradient(180deg,#303c52 0%,#222e43 100%); border-color:#3c4b64; }\n.key.fn .main,.key.ctrl .main { font-size:clamp(10px,2.8vw,13px); }\n.key.num { background:linear-gradient(180deg,#45536a 0%,#303d52 100%); border-color:#52627a; }\n.key.num .main { font-size:clamp(19px,4.8vw,23px); font-weight:560; }\n.key.op { background:linear-gradient(180deg,#31577c 0%,#23415f 100%); border-color:#47729a; }\n.key.eq { background:linear-gradient(180deg,#f1c36c 0%,#d99b3d 100%); border-color:#f7d28b; color:#172238; box-shadow:0 3px 0 #93652c,inset 0 1px 0 #fff8e8; }\n.key.ac { background:linear-gradient(180deg,#d86b70 0%,#b84350 100%); border-color:#e58a8f; color:#fff; box-shadow:0 3px 0 #762b37,inset 0 1px 0 #ffffff30; }\n.key.del { background:linear-gradient(180deg,#9b5360 0%,#713b4a 100%); border-color:#b66b78; color:#fff; box-shadow:0 3px 0 #482633,inset 0 1px 0 #ffffff25; }\n.key .shift-label { top:4px;bottom:auto;left:5px;color:#ffd071;font-size:clamp(6px,1.55vw,8px);font-weight:800; }\n.key .alpha-label { top:4px;bottom:auto;right:5px;color:#d0b7ff;font-size:clamp(6px,1.55vw,8px);font-weight:800; }\n.key.active-toggle { background:linear-gradient(180deg,#f7d27e,#d99b3d)!important;color:#172238!important;border-color:#ffe2a5!important;box-shadow:0 3px 0 #93652c!important; }\n.bottom-sheet { background:linear-gradient(180deg,#1c2940,#111a2c); border:1px solid #34445e; }\n.sheet-backdrop { background:rgba(4,8,16,.72); }\n@media (min-width:600px) {\n  .app { max-width:520px; border-left:1px solid rgba(255,255,255,.06); border-right:1px solid rgba(255,255,255,.06); }\n  .keypad { gap:7px; padding-left:14px; padding-right:14px; }\n}\n@media (max-height:700px) {\n  .top-bar { min-height:44px; flex-basis:44px; }\n  .status-bar { min-height:22px; flex-basis:22px; }\n  .display-wrap { min-height:112px; margin:7px 10px; padding:10px 13px; }\n  .keypad { gap:4px; padding:5px 9px 8px; }\n  .key { border-radius:8px; }\n}\n@media (orientation:landscape) and (max-height:480px) {\n  .display-wrap { flex-basis:20vh; min-height:78px; max-height:120px; }\n  .keypad { gap:3px; padding:3px 8px 5px; }\n}\n\n";

  /* ---------- 2. HTML body markup (built via innerHTML) ---------- */
  var CALC991_BODY = "<!-- Splash -->\n<div class=\"splash\" id=\"splash\">\n  <div class=\"splash-icon\">991</div>\n  <div class=\"splash-text\">SCIENTIFIC CALCULATOR</div>\n</div>\n\n<!-- App -->\n<div class=\"app\">\n  <div class=\"top-bar\">\n    <div class=\"brand\">\n      <div class=\"brand-icon\">991</div>\n      <span>SCIENTIFIC</span>\n    </div>\n    <div class=\"top-actions\">\n      <button class=\"icon-btn\" id=\"btnHistory\" title=\"History\">\n        <svg viewBox=\"0 0 24 24\"><path d=\"M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z\"/></svg>\n      </button>\n      <button class=\"icon-btn\" id=\"btnModes\" title=\"Modes\">\n        <svg viewBox=\"0 0 24 24\"><path d=\"M12 2l-5.5 9h11L12 2zm5.5 11c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zM3 13.5h8v8H3v-8z\"/></svg>\n      </button>\n      <button class=\"icon-btn\" id=\"btnHelp\" title=\"Help\">\n        <svg viewBox=\"0 0 24 24\"><path d=\"M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z\"/></svg>\n      </button>\n    </div>\n  </div>\n\n  <div class=\"status-bar\" id=\"statusBar\">\n    <span class=\"ind ang\" id=\"ind-angle\">DEG</span>\n    <span class=\"sep\">\u00b7</span>\n    <span class=\"ind\" id=\"ind-mode\">COMP</span>\n    <span class=\"sep\">\u00b7</span>\n    <span class=\"ind\" id=\"ind-shift\">SHIFT</span>\n    <span class=\"ind\" id=\"ind-alpha\">ALPHA</span>\n    <span class=\"ind\" id=\"ind-hyp\">HYP</span>\n    <span class=\"ind\" id=\"ind-mem\">M</span>\n    <span class=\"ind\" id=\"ind-sto\">STO</span>\n    <span class=\"ind\" id=\"ind-disp\"></span>\n    <span class=\"ind err\" id=\"ind-err\"></span>\n  </div>\n\n  <div class=\"display-wrap\" id=\"displayWrap\">\n    <div class=\"input-expr\" id=\"inputExpr\"></div>\n    <div class=\"result-line placeholder\" id=\"resultLine\">Result</div>\n  </div>\n\n  <div class=\"keypad\" id=\"keypad\"></div>\n</div>\n\n<!-- Bottom sheet -->\n<div class=\"sheet-backdrop\" id=\"sheetBackdrop\"></div>\n<div class=\"bottom-sheet\" id=\"bottomSheet\">\n  <div class=\"sheet-handle\"></div>\n  <div class=\"sheet-header\">\n    <div class=\"sheet-title\" id=\"sheetTitle\">History</div>\n    <button class=\"icon-btn\" id=\"closeSheet\">\n      <svg viewBox=\"0 0 24 24\"><path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/></svg>\n    </button>\n  </div>\n  <div class=\"sheet-tabs\" id=\"sheetTabs\">\n    <button class=\"sheet-tab active\" data-stab=\"history\">History</button>\n    <button class=\"sheet-tab\" data-stab=\"modes\">Modes</button>\n    <button class=\"sheet-tab\" data-stab=\"help\">Help</button>\n  </div>\n  <div class=\"sheet-content\" id=\"sheetContent\"></div>\n</div>\n\n<!-- Overlay -->\n<div class=\"overlay\" id=\"overlay\">\n  <div class=\"overlay-box\" id=\"overlayBox\"></div>\n</div>\n\n<!-- Toast -->\n<div class=\"toast\" id=\"toast\"></div>\n\n<!-- Long-press hint -->\n<div class=\"long-hint\" id=\"longHint\"></div>";

  /* ---------- 3. Inject <meta> tags into <head> ---------- */
  function injectMeta() {
    var doc = document;
    var head = doc.head || doc.documentElement;
    function addMeta(name, content) {
      var m = doc.createElement('meta');
      m.setAttribute('name', name);
      m.setAttribute('content', content);
      head.appendChild(m);
    }
    var charset = doc.createElement('meta');
    charset.setAttribute('charset', 'UTF-8');
    head.appendChild(charset);
    var viewport = doc.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    head.appendChild(viewport);
    addMeta('theme-color', '#0b1020');
    addMeta('apple-mobile-web-app-capable', 'yes');
    addMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    addMeta('mobile-web-app-capable', 'yes');
    addMeta('apple-mobile-web-app-title', 'Calc 991');
    if (!doc.title) doc.title = 'Scientific Calculator 991';
    if (!doc.documentElement.getAttribute('lang')) {
      doc.documentElement.setAttribute('lang', 'en');
    }
  }

  /* ---------- 4. Inject <style> ---------- */
  function injectStyles() {
    var head = document.head || document.documentElement;
    var existing = document.getElementById('calc991-styles');
    if (existing) existing.parentNode.removeChild(existing);
    var style = document.createElement('style');
    style.id = 'calc991-styles';
    style.textContent = CALC991_CSS;
    head.appendChild(style);
  }

  /* ---------- 5. Build DOM ---------- */
  function buildDOM() {
    // Clear body and inject our markup. Using innerHTML is the fastest
    // way to materialise the static structure; everything afterwards
    // (keypad buttons, overlays, etc.) is created dynamically by the
    // original app code.
    document.body.innerHTML = CALC991_BODY;
    document.body.style.margin = '0';
  }

  /* ---------- 6. Run the original calculator application ---------- */
  function startApp() {

    /* =====================================================================
       SCIENTIFIC CALCULATOR 991 PLUS — Mobile-First Vanilla JS
       ===================================================================== */

    /* ---------- State ---------- */
    const S = {
      expr: '',
      result: '',
      memory: 0,
      angleMode: 'DEG',
      displayMode: 'NORM',
      fixDigits: 4,
      shift: false,
      alpha: false,
      hyp: false,
      mode: 'COMP',
      history: [],
      lastAnswer: 0,
      variables: { A:0,B:0,C:0,D:0,E:0,F:0,X:0,Y:0,M:0 },
      cursor: -1,
      storeTarget: null,
      recallMode: false,
      error: null,
      justEvaluated: false,
    };

    /* ---------- Math helpers ---------- */
    function toRad(x){
      if (S.angleMode === 'DEG') return x * Math.PI / 180;
      if (S.angleMode === 'GRA') return x * Math.PI / 200;
      return x;
    }
    function fromRad(r){
      if (S.angleMode === 'DEG') return r * 180 / Math.PI;
      if (S.angleMode === 'GRA') return r * 200 / Math.PI;
      return r;
    }
    function factorial(n){
      if (n < 0 || !Number.isInteger(n)) return NaN;
      if (n > 170) return Infinity;
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    }
    function nPr(n, r){
      if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r) || r > n) return NaN;
      return factorial(n) / factorial(n - r);
    }
    function nCr(n, r){
      if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r) || r > n) return NaN;
      return factorial(n) / (factorial(r) * factorial(n - r));
    }
    function gcd(a, b){
      a = Math.abs(Math.trunc(a)); b = Math.abs(Math.trunc(b));
      while (b) { [a, b] = [b, a % b]; }
      return a;
    }
    function lcm(a, b){
      a = Math.trunc(a); b = Math.trunc(b);
      if (a === 0 || b === 0) return 0;
      return Math.abs(a * b) / gcd(a, b);
    }
    function mod(a, b){ return ((a % b) + b) % b; }
    function intPart(x){ return Math.trunc(x); }
    function fracPart(x){ return x - Math.trunc(x); }
    function roundN(x, n){ const p = Math.pow(10, n); return Math.round(x * p) / p; }
    function Pol(r, th){ return [r * Math.cos(toRad(th)), r * Math.sin(toRad(th))]; }
    function Rec(x, y){
      const r = Math.hypot(x, y);
      let th = Math.atan2(y, x);
      th = fromRad(th);
      return [r, th];
    }
    function toDMS(decimal){
      let sign = decimal < 0 ? -1 : 1;
      decimal = Math.abs(decimal);
      let d = Math.floor(decimal);
      let mFloat = (decimal - d) * 60;
      let m = Math.floor(mFloat);
      let s = (mFloat - m) * 60;
      return [sign * d, m, s];
    }
    function fromDMS(d, m, s){ return d + m/60 + s/3600; }
    const HYP = {
      sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
      asinh: Math.asinh, acosh: Math.acosh, atanh: Math.atanh,
      sech: (x)=>1/Math.cosh(x),
      csch: (x)=>1/Math.sinh(x),
      coth: (x)=>1/Math.tanh(x),
      asech: (x)=>Math.acosh(1/x),
      acsch: (x)=>Math.asinh(1/x),
      acoth: (x)=>Math.atanh(1/x),
    };

    /* ---------- Fraction support ---------- */
    function gcd2(a,b){ a=Math.abs(Math.trunc(a)); b=Math.abs(Math.trunc(b)); while(b){[a,b]=[b,a%b];} return a||1; }
    function toFraction(x, maxDenom){
      maxDenom = maxDenom || 1000;
      if (!isFinite(x) || Math.abs(x) > 1e15) return null;
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x);
      const whole = Math.floor(x);
      let frac = x - whole;
      if (frac < 1e-9) return { sign, whole, num:0, den:1 };
      // Continued fraction: h_{-1}=1, h_0=0, k_{-1}=0, k_0=1
      let hPrev2=1, hPrev1=0, kPrev2=0, kPrev1=1;
      let b = frac;
      for (let i=0; i<25; i++){
        if (Math.abs(b) < 1e-12) break;
        const a = Math.floor(1/b);
        const h = a*hPrev1 + hPrev2;
        const k = a*kPrev1 + kPrev2;
        if (k > maxDenom) break;
        hPrev2 = hPrev1; hPrev1 = h;
        kPrev2 = kPrev1; kPrev1 = k;
        const approx = hPrev1 / kPrev1;
        if (Math.abs(approx - frac) < 1e-12) break;
        b = 1/b - a;
      }
      const g = gcd2(hPrev1, kPrev1);
      return { sign, whole, num: hPrev1/g, den: kPrev1/g };
    }
    function formatFraction(x){
      const f = toFraction(x);
      if (!f) return formatResult(x);
      if (f.num === 0) return (f.sign<0?'-':'') + f.whole;
      if (f.whole === 0) return (f.sign<0?'-':'') + f.num + '/' + f.den;
      return (f.sign<0?'-':'') + f.whole + ' ' + f.num + '/' + f.den;
    }

    /* ---------- Numerical calculus ---------- */
    function numericalDerivative(expr, xVal, h){
      h = h || 1e-5;
      const sub = (v) => expr.replace(/\bX\b/g, '(' + v + ')');
      const r1 = fullEval(sub(xVal + h));
      const r2 = fullEval(sub(xVal - h));
      if (!r1.ok || !r2.ok) return NaN;
      return (r1.value - r2.value) / (2 * h);
    }
    function numericalIntegral(expr, a, b, n){
      n = n || 1000;
      if (n % 2) n++;
      const h = (b - a) / n;
      const sub = (v) => expr.replace(/\bX\b/g, '(' + v + ')');
      let sum = 0;
      for (let i = 0; i <= n; i++){
        const x = a + i * h;
        const r = fullEval(sub(x));
        if (!r.ok) return NaN;
        const w = (i === 0 || i === n) ? 1 : (i % 2 === 0 ? 2 : 4);
        sum += w * r.value;
      }
      return (h / 3) * sum;
    }
    function summation(expr, kVar, start, end){
      let sum = 0;
      for (let k = start; k <= end; k++){
        const sub = expr.replace(new RegExp('\\b'+kVar+'\\b','g'), '(' + k + ')');
        const r = fullEval(sub);
        if (!r.ok) return NaN;
        sum += r.value;
      }
      return sum;
    }

    /* ---------- Complex number support ---------- */
    function parseCx(s){
      s = s.trim().replace(/\s/g,'').replace(/i/g,'j').replace(/j$/,'');
      s = s.replace(/∠/g, ',');
      // polar r∠θ form
      const pol = s.match(/^(-?\d+(?:\.\d+)?(?:e-?\d+)?),(-?\d+(?:\.\d+)?(?:e-?\d+)?)$/);
      if (pol){
        const r = parseFloat(pol[1]);
        const th = parseFloat(pol[2]);
        return { re: r * Math.cos(toRad(th)), im: r * Math.sin(toRad(th)) };
      }
      const m2 = s.match(/^(-?\d+(?:\.\d+)?(?:e-?\d+)?)j$/);
      const m3 = s.match(/^(-?\d+(?:\.\d+)?(?:e-?\d+)?)$/);
      const m = s.match(/^(-?\d+(?:\.\d+)?(?:e-?\d+)?)\+?(-?)?(\d+(?:\.\d+)?)?j?$/);
      if (m2) return {re:0, im:parseFloat(m2[1])};
      if (m3) return {re:parseFloat(m3[1]), im:0};
      if (m){
        const re = parseFloat(m[1]);
        const im = m[3] ? (m[2]==='-'?-1:1)*parseFloat(m[3]) : 0;
        return {re, im};
      }
      return null;
    }
    function fmtCx(c){
      const re = formatResult(c.re);
      const im = formatResult(Math.abs(c.im));
      if (Math.abs(c.im) < 1e-12) return re;
      if (Math.abs(c.re) < 1e-12) return im + 'i';
      return `${re} ${c.im>=0?'+':'−'} ${im}i`;
    }
    function cxRe(c){ return c.re; }
    function cxIm(c){ return c.im; }
    function cxConj(c){ return {re:c.re, im:-c.im}; }
    function cxAbs(c){ return Math.hypot(c.re, c.im); }
    function cxArg(c){ return fromRad(Math.atan2(c.im, c.re)); }
    function cxAdd(a,b){ return {re:a.re+b.re, im:a.im+b.im}; }
    function cxSub(a,b){ return {re:a.re-b.re, im:a.im-b.im}; }
    function cxMul(a,b){ return {re:a.re*b.re-a.im*b.im, im:a.re*b.im+a.im*b.re}; }
    function cxDiv(a,b){ const d=b.re*b.re+b.im*b.im; return {re:(a.re*b.re+a.im*b.im)/d, im:(a.im*b.re-a.re*b.im)/d}; }

    /* ---------- Matrix operations ---------- */
    S.matrices = { A:null, B:null, C:null, Ans:null };
    function matCreate(rows, cols, data){ return { rows, cols, data: data || new Array(rows*cols).fill(0) }; }
    function matValidate(m){ if (!m || !m.rows || !m.cols || !m.data) throw new Error('Invalid matrix'); }
    function matAdd(a,b){ matValidate(a); matValidate(b); if (a.rows!==b.rows||a.cols!==b.cols) throw new Error('Dim mismatch'); const r = matCreate(a.rows,a.cols); for (let i=0;i<r.data.length;i++) r.data[i]=a.data[i]+b.data[i]; return r; }
    function matSub(a,b){ matValidate(a); matValidate(b); if (a.rows!==b.rows||a.cols!==b.cols) throw new Error('Dim mismatch'); const r = matCreate(a.rows,a.cols); for (let i=0;i<r.data.length;i++) r.data[i]=a.data[i]-b.data[i]; return r; }
    function matMul(a,b){ matValidate(a); matValidate(b); if (a.cols!==b.rows) throw new Error('Dim mismatch'); const r = matCreate(a.rows,b.cols); for (let i=0;i<a.rows;i++) for (let j=0;j<b.cols;j++){ let s=0; for (let k=0;k<a.cols;k++) s += a.data[i*a.cols+k]*b.data[k*b.cols+j]; r.data[i*b.cols+j] = s; } return r; }
    function matScale(a, s){ matValidate(a); const r = matCreate(a.rows,a.cols); for (let i=0;i<r.data.length;i++) r.data[i]=a.data[i]*s; return r; }
    function matTranspose(a){ matValidate(a); const r = matCreate(a.cols,a.rows); for (let i=0;i<a.rows;i++) for (let j=0;j<a.cols;j++) r.data[j*a.rows+i]=a.data[i*a.cols+j]; return r; }
    function matDet(m){
      matValidate(m);
      if (m.rows !== m.cols) throw new Error('Not square');
      const n = m.rows;
      if (n === 1) return m.data[0];
      if (n === 2) return m.data[0]*m.data[3] - m.data[1]*m.data[2];
      // LU decomposition
      let A = m.data.slice();
      let det = 1;
      for (let i = 0; i < n; i++){
        let pivot = i;
        for (let j = i+1; j < n; j++) if (Math.abs(A[j*n+i]) > Math.abs(A[pivot*n+i])) pivot = j;
        if (pivot !== i){ for (let k = 0; k < n; k++){ const t = A[i*n+k]; A[i*n+k] = A[pivot*n+k]; A[pivot*n+k] = t; } det = -det; }
        if (Math.abs(A[i*n+i]) < 1e-14) return 0;
        det *= A[i*n+i];
        for (let j = i+1; j < n; j++){
          const f = A[j*n+i] / A[i*n+i];
          for (let k = i; k < n; k++) A[j*n+k] -= f * A[i*n+k];
        }
      }
      return det;
    }
    function matInverse(m){
      matValidate(m);
      if (m.rows !== m.cols) throw new Error('Not square');
      const n = m.rows;
      const A = m.data.slice();
      const I = new Array(n*n).fill(0);
      for (let i = 0; i < n; i++) I[i*n+i] = 1;
      for (let i = 0; i < n; i++){
        let pivot = i;
        for (let j = i+1; j < n; j++) if (Math.abs(A[j*n+i]) > Math.abs(A[pivot*n+i])) pivot = j;
        if (pivot !== i){ for (let k = 0; k < n; k++){ const t=A[i*n+k]; A[i*n+k]=A[pivot*n+k]; A[pivot*n+k]=t; const t2=I[i*n+k]; I[i*n+k]=I[pivot*n+k]; I[pivot*n+k]=t2; } }
        const d = A[i*n+i];
        if (Math.abs(d) < 1e-14) throw new Error('Singular');
        for (let k = 0; k < n; k++){ A[i*n+k] /= d; I[i*n+k] /= d; }
        for (let j = 0; j < n; j++) if (j !== i){
          const f = A[j*n+i];
          for (let k = 0; k < n; k++){ A[j*n+k] -= f*A[i*n+k]; I[j*n+k] -= f*I[i*n+k]; }
        }
      }
      return { rows:n, cols:n, data:I };
    }
    function matIdentity(n){ const m = matCreate(n,n); for (let i=0;i<n;i++) m.data[i*n+i]=1; return m; }
    function matFormat(m){ let s=''; for (let i=0;i<m.rows;i++){ s += '['; for (let j=0;j<m.cols;j++){ s += formatResult(m.data[i*m.cols+j]); if (j<m.cols-1) s += ', '; } s += ']'; if (i<m.rows-1) s += '\n'; } return s; }

    /* ---------- Vector operations ---------- */
    S.vectors = { A:null, B:null, C:null, Ans:null };
    function vctCreate(dim, data){ return { dim, data: data || new Array(dim).fill(0) }; }
    function vctAdd(a,b){ if (a.dim!==b.dim) throw new Error('Dim mismatch'); return vctCreate(a.dim, a.data.map((v,i)=>v+b.data[i])); }
    function vctSub(a,b){ if (a.dim!==b.dim) throw new Error('Dim mismatch'); return vctCreate(a.dim, a.data.map((v,i)=>v-b.data[i])); }
    function vctDot(a,b){ if (a.dim!==b.dim) throw new Error('Dim mismatch'); return a.data.reduce((s,v,i)=>s+v*b.data[i], 0); }
    function vctCross(a,b){
      if (a.dim !== 3 || b.dim !== 3) throw new Error('Cross product needs 3D');
      return vctCreate(3, [
        a.data[1]*b.data[2] - a.data[2]*b.data[1],
        a.data[2]*b.data[0] - a.data[0]*b.data[2],
        a.data[0]*b.data[1] - a.data[1]*b.data[0]
      ]);
    }
    function vctAbs(a){ return Math.hypot(...a.data); }
    function vctAngle(a,b){ const d = vctDot(a,b); const m = vctAbs(a)*vctAbs(b); if (Math.abs(m)<1e-14) return 0; return fromRad(Math.acos(d/m)); }
    function vctFormat(v){ return '[' + v.data.map(formatResult).join(', ') + ']'; }

    /* ---------- Logical operations (BASE-N) ---------- */
    function logAnd(a,b){ return (Math.trunc(a) & Math.trunc(b)) >>> 0; }
    function logOr(a,b){ return (Math.trunc(a) | Math.trunc(b)) >>> 0; }
    function logXor(a,b){ return (Math.trunc(a) ^ Math.trunc(b)) >>> 0; }
    function logXnor(a,b){ return (~(Math.trunc(a) ^ Math.trunc(b))) >>> 0; }
    function logNot(a){ return (~Math.trunc(a)) >>> 0; }
    function logNeg(a, bits){ bits = bits || 32; return ((~Math.trunc(a))+1) & ((1<<bits)-1); }

    /* ---------- CALC / SOLVE functions ---------- */
    function calcFunction(expr, varName, value){
      const sub = expr.replace(new RegExp('\\b'+varName+'\\b','g'), '(' + value + ')');
      return fullEval(sub);
    }
    function solveFunction(expr, varName, guess){
      // Newton's method
      let x = guess || 1;
      const h = 1e-6;
      for (let i = 0; i < 200; i++){
        const f = calcFunction(expr, varName, x);
        if (!f.ok) return { ok:false, error:'Eval error' };
        const fx = f.value;
        if (Math.abs(fx) < 1e-10) return { ok:true, value:x, iterations:i };
        const f1 = calcFunction(expr, varName, x + h);
        const f2 = calcFunction(expr, varName, x - h);
        if (!f1.ok || !f2.ok) return { ok:false, error:'Eval error' };
        const dfx = (f1.value - f2.value) / (2*h);
        if (Math.abs(dfx) < 1e-14) return { ok:false, error:'Div by zero derivative' };
        const xNew = x - fx / dfx;
        if (Math.abs(xNew - x) < 1e-10 && Math.abs(fx) < 1e-6) return { ok:true, value:xNew, iterations:i };
        x = xNew;
      }
      return { ok:false, error:'Did not converge' };
    }

    /* ---------- 40 Scientific Constants ---------- */
    const CONSTANTS = [
      { id:1,  name:'Proton mass',                 sym:'mp',  val:1.67262192369e-27,  unit:'kg' },
      { id:2,  name:'Neutron mass',                sym:'mn',  val:1.67492749804e-27,  unit:'kg' },
      { id:3,  name:'Electron mass',               sym:'me',  val:9.1093837015e-31,   unit:'kg' },
      { id:4,  name:'Muon mass',                   sym:'mμ',  val:1.883531627e-28,    unit:'kg' },
      { id:5,  name:'Bohr radius',                 sym:'a0',  val:5.29177210903e-11,  unit:'m' },
      { id:6,  name:'Planck constant',             sym:'h',   val:6.62607015e-34,     unit:'J·s' },
      { id:7,  name:'Nuclear magneton',             sym:'μN',  val:5.050783699e-27,    unit:'J/T' },
      { id:8,  name:'Bohr magneton',               sym:'μB',  val:9.2740100783e-24,   unit:'J/T' },
      { id:9,  name:'Reduced Planck constant',     sym:'ℏ',   val:1.054571817e-34,    unit:'J·s' },
      { id:10, name:'Fine-structure constant',     sym:'α',   val:7.2973525693e-3,    unit:'' },
      { id:11, name:'Classical electron radius',   sym:'re',  val:2.8179403262e-15,   unit:'m' },
      { id:12, name:'Electron Compton wavelength', sym:'λC',  val:2.4263102367e-12,   unit:'m' },
      { id:13, name:'Proton gyromagnetic ratio',   sym:'γp',  val:2.6752218744e8,     unit:'rad/(s·T)' },
      { id:14, name:'Proton Compton wavelength',   sym:'λCp', val:1.321408847e-15,    unit:'m' },
      { id:15, name:'Neutron Compton wavelength',  sym:'λCn', val:1.319592042e-15,    unit:'m' },
      { id:16, name:'Rydberg constant',            sym:'R∞',  val:10973731.568160,    unit:'m⁻¹' },
      { id:17, name:'Atomic mass unit',            sym:'u',   val:1.66053906660e-27,  unit:'kg' },
      { id:18, name:'Proton magnetic moment',      sym:'μp',  val:1.41060679736e-26,  unit:'J/T' },
      { id:19, name:'Electron magnetic moment',    sym:'μe',  val:-9.2847647043e-24,  unit:'J/T' },
      { id:20, name:'Neutron magnetic moment',     sym:'μn',  val:-9.6623651e-27,     unit:'J/T' },
      { id:21, name:'Muon magnetic moment',        sym:'μμ',  val:-4.49044830e-26,    unit:'J/T' },
      { id:22, name:'Faraday constant',            sym:'F',   val:96485.33212,        unit:'C/mol' },
      { id:23, name:'Elementary charge',           sym:'e',   val:1.602176634e-19,    unit:'C' },
      { id:24, name:'Avogadro constant',           sym:'NA',  val:6.02214076e23,      unit:'mol⁻¹' },
      { id:25, name:'Boltzmann constant',           sym:'k',   val:1.380649e-23,       unit:'J/K' },
      { id:26, name:'Molar volume of ideal gas',   sym:'Vm',  val:22.41396954e-3,     unit:'m³/mol' },
      { id:27, name:'Molar gas constant',          sym:'R',   val:8.314462618,        unit:'J/(mol·K)' },
      { id:28, name:'Speed of light',              sym:'c',   val:299792458,          unit:'m/s' },
      { id:29, name:'First radiation constant',    sym:'c1',  val:3.741771852e-16,    unit:'W·m²' },
      { id:30, name:'Second radiation constant',   sym:'c2',  val:1.438776877e-2,     unit:'m·K' },
      { id:31, name:'Stefan–Boltzmann constant',   sym:'σ',   val:5.670374419e-8,     unit:'W/(m²·K⁴)' },
      { id:32, name:'Electric constant',           sym:'ε0',  val:8.8541878128e-12,   unit:'F/m' },
      { id:33, name:'Magnetic constant',           sym:'μ0',  val:1.25663706212e-6,   unit:'H/m' },
      { id:34, name:'Magnetic flux quantum',       sym:'Φ0',  val:2.067833848e-15,    unit:'Wb' },
      { id:35, name:'Standard gravity',            sym:'g',   val:9.80665,             unit:'m/s²' },
      { id:36, name:'Conductance quantum',          sym:'G0',  val:7.748091729e-5,     unit:'S' },
      { id:37, name:'Char. impedance of vacuum',   sym:'Z0',  val:376.730313668,       unit:'Ω' },
      { id:38, name:'Celsius temperature',          sym:'T',   val:273.15,              unit:'K' },
      { id:39, name:'Newtonian grav. constant',    sym:'G',   val:6.6743e-11,          unit:'m³/(kg·s²)' },
      { id:40, name:'Standard atmosphere',          sym:'atm', val:101325,              unit:'Pa' },
    ];

    /* ---------- 40 Metric Conversions ---------- */
    const CONVERSIONS = [
      { id:1,  name:'in → cm',     f:(x)=>x*2.54 },
      { id:2,  name:'cm → in',     f:(x)=>x/2.54 },
      { id:3,  name:'ft → m',      f:(x)=>x*0.3048 },
      { id:4,  name:'m → ft',      f:(x)=>x/0.3048 },
      { id:5,  name:'yd → m',      f:(x)=>x*0.9144 },
      { id:6,  name:'m → yd',      f:(x)=>x/0.9144 },
      { id:7,  name:'mi → km',     f:(x)=>x*1.609344 },
      { id:8,  name:'km → mi',     f:(x)=>x/1.609344 },
      { id:9,  name:'nmi → m',     f:(x)=>x*1852 },
      { id:10, name:'m → nmi',     f:(x)=>x/1852 },
      { id:11, name:'acre → m²',   f:(x)=>x*4046.8564224 },
      { id:12, name:'m² → acre',   f:(x)=>x/4046.8564224 },
      { id:13, name:'gal(US) → L', f:(x)=>x*3.785411784 },
      { id:14, name:'L → gal(US)', f:(x)=>x/3.785411784 },
      { id:15, name:'gal(UK) → L', f:(x)=>x*4.54609 },
      { id:16, name:'L → gal(UK)', f:(x)=>x/4.54609 },
      { id:17, name:'pc → km',     f:(x)=>x*3.08567758149137e13 },
      { id:18, name:'km → pc',     f:(x)=>x/3.08567758149137e13 },
      { id:19, name:'km/h → m/s',  f:(x)=>x/3.6 },
      { id:20, name:'m/s → km/h',  f:(x)=>x*3.6 },
      { id:21, name:'oz → g',      f:(x)=>x*28.349523125 },
      { id:22, name:'g → oz',      f:(x)=>x/28.349523125 },
      { id:23, name:'lb → kg',     f:(x)=>x*0.45359237 },
      { id:24, name:'kg → lb',     f:(x)=>x/0.45359237 },
      { id:25, name:'atm → Pa',    f:(x)=>x*101325 },
      { id:26, name:'Pa → atm',    f:(x)=>x/101325 },
      { id:27, name:'mmHg → Pa',   f:(x)=>x*133.322387415 },
      { id:28, name:'Pa → mmHg',   f:(x)=>x/133.322387415 },
      { id:29, name:'hp → kW',     f:(x)=>x*0.7456998715822702 },
      { id:30, name:'kW → hp',     f:(x)=>x/0.7456998715822702 },
      { id:31, name:'kgf/cm² → Pa', f:(x)=>x*98066.5 },
      { id:32, name:'Pa → kgf/cm²', f:(x)=>x/98066.5 },
      { id:33, name:'kgf·m → J',   f:(x)=>x*9.80665 },
      { id:34, name:'J → kgf·m',   f:(x)=>x/9.80665 },
      { id:35, name:'psi → kPa',   f:(x)=>x*6.894757293168361 },
      { id:36, name:'kPa → psi',   f:(x)=>x/6.894757293168361 },
      { id:37, name:'°F → °C',     f:(x)=>(x-32)*5/9 },
      { id:38, name:'°C → °F',     f:(x)=>x*9/5+32 },
      { id:39, name:'J → cal',     f:(x)=>x/4.184 },
      { id:40, name:'cal → J',     f:(x)=>x*4.184 },
    ];

    /* ---------- Expression evaluator ---------- */
    function preprocessDMS(expr){
      return expr
        .replace(/(-?\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)'(\d+(?:\.\d+)?)"/g,
          (_, d, m, s) => `fromDMS(${d},${m},${s})`)
        .replace(/(-?\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)'/g,
          (_, d, m) => `fromDMS(${d},${m},0)`)
        .replace(/(-?\d+(?:\.\d+)?)°/g, '($1)')
        .replace(/(-?\d+(?:\.\d+)?)'/g, '($1/60)')
        .replace(/(-?\d+(?:\.\d+)?)"(?! )/g, '($1/3600)');
    }

    function evaluateExpression(rawExpr){
      if (!rawExpr || !rawExpr.trim()) return { ok:false, error:'Empty' };
      let e = rawExpr;
      e = e.replace(/\blog2\(/g, 'logTwo(').replace(/\bexp10\(/g, 'expTen(');
      e = e.replace(/π/g, '(PI)');
      e = e.replace(/(?<![A-Za-z0-9_])e(?![A-Za-z0-9_])/g, '(EULER)');
      e = e.replace(/×/g, '*');
      e = e.replace(/÷/g, '/');
      e = e.replace(/−/g, '-');
      e = e.replace(/\^/g, '**');
      e = e.replace(/√/g, 'sqrt');
      e = e.replace(/∛/g, 'cbrt');
      e = e.replace(/°/g, 'deg');
      e = e.replace(/Ans/g, 'ANS');
      e = e.replace(/\s+MOD\s+/g, '%');
      e = e.replace(/\s*MOD\s*/g, '%');
      e = e.replace(/\bGCD\b/g, 'gcd');
      e = e.replace(/\bLCM\b/g, 'lcm');
      e = e.replace(/\bABS\b/g, 'abs');
      e = e.replace(/\bINT\b/g, 'intPart');
      e = e.replace(/\bFRAC\b/g, 'fracPart');
      e = e.replace(/\bRND\b/g, 'roundN');
      // Implicit multiplication
      e = e.replace(/(?<![A-Za-z_])(\d)(\()/g, '$1*$2');
      e = e.replace(/(\))(\()/g, '$1*$2');
      e = e.replace(/(\))(\d)/g, '$1*$2');
      e = e.replace(/(\d)([A-Za-z√])/g, '$1*$2');
      e = e.replace(/(\))([A-Za-z√])/g, '$1*$2');

      const scope = {
        PI: Math.PI, EULER: Math.E, E: Math.E, ANS: S.lastAnswer,
        sin:(x)=>Math.sin(toRad(x)),
        cos:(x)=>Math.cos(toRad(x)),
        tan:(x)=>Math.tan(toRad(x)),
        asin:(x)=>fromRad(Math.asin(x)),
        acos:(x)=>fromRad(Math.acos(x)),
        atan:(x)=>fromRad(Math.atan(x)),
        sinh:HYP.sinh, cosh:HYP.cosh, tanh:HYP.tanh,
        asinh:HYP.asinh, acosh:HYP.acosh, atanh:HYP.atanh,
        sech:HYP.sech, csch:HYP.csch, coth:HYP.coth,
        asech:HYP.asech, acsch:HYP.acsch, acoth:HYP.acoth,
        sec:(x)=>1/Math.cos(toRad(x)),
        csc:(x)=>1/Math.sin(toRad(x)),
        cot:(x)=>1/Math.tan(toRad(x)),
        asec:(x)=>fromRad(Math.acos(1/x)),
        acsc:(x)=>fromRad(Math.asin(1/x)),
        acot:(x)=>fromRad(Math.atan(1/x)),
        log:(x)=>Math.log10(x), ln:Math.log, lg:(x)=>Math.log10(x),
        logTwo:(x)=>Math.log2(x), logb:(b,x)=>Math.log(x)/Math.log(b),
        exp:(x)=>Math.exp(x), expTen:(x)=>Math.pow(10,x),
        sqrt:Math.sqrt, cbrt:Math.cbrt, abs:Math.abs, fact:factorial,
        nPr, nCr, gcd, lcm, mod,
        intPart, fracPart, roundN,
        pow:Math.pow, root:(x,n)=>Math.pow(x,1/n),
        floor:Math.floor, ceil:Math.ceil, round:Math.round, sign:Math.sign,
        min:Math.min, max:Math.max, hypot:Math.hypot,
        Pol, Rec, fromDMS, deg:(x)=>x,
        // Numerical calculus (called with stringified expr)
        numericalDerivative:(expr,x)=>numericalDerivative(expr,x),
        numericalIntegral:(expr,a,b)=>numericalIntegral(expr,a,b),
        summation:(expr,k,a,b)=>summation(expr,k,a,b),
        // Logical ops
        and:logAnd, or:logOr, xor:logXor, xnor:logXnor, not:logNot, neg:logNeg,
        ...S.variables
      };

      try {
        const fn = new Function(...Object.keys(scope), '"use strict"; return (' + e + ');');
        let r = fn(...Object.values(scope));
        if (typeof r !== 'number' || !isFinite(r)) return { ok:false, error:'Math error' };
        return { ok:true, value:r };
      } catch (err) {
        return { ok:false, error: err.message };
      }
    }

    function fullEval(raw){
      let e = preprocessDMS(raw);
      e = e.replace(/x⁻¹/g, '^(-1)');
      // nth root: ⁿ√(a,b) -> b^(1/a); also ⁿ√(x) as cbrt fallback
      e = e.replace(/ⁿ√\(([^,]+),([^)]+)\)/g, '(($2)**(1/($1)))');
      e = e.replace(/ⁿ√\(/g, 'cbrt(');
      e = e.replace(/ABS\(/g, 'abs(');
      // factorial postfix
      e = e.replace(/(\d+(?:\.\d+)?|\))!/g, 'fact($1)');
      e = e.replace(/([A-Za-z_]\w*)!/g, 'fact($1)');
      // d/dx(expr, x) -> numericalDerivative
      e = e.replace(/d\/dx\(([^,]+),([^,)]+)\)/g, 'numericalDerivative("$1",$2)');
      // ∫(expr, a, b) -> numericalIntegral
      e = e.replace(/∫\(([^,]+),([^,]+),([^)]+)\)/g, 'numericalIntegral("$1",$2,$3)');
      // Σ(expr, k, start, end) -> summation
      e = e.replace(/Σ\(([^,]+),([A-Za-z]),([^,]+),([^)]+)\)/g, 'summation("$1","$2",$3,$4)');
      // logb(b, x) -> log base b
      // Complex: Re( a+bi ) - we leave as-is for parsing
      return evaluateExpression(e);
    }

    function formatResult(v){
      if (typeof v !== 'number') return String(v);
      if (!isFinite(v)) return v > 0 ? '∞' : (v < 0 ? '-∞' : 'NaN');
      if (Number.isInteger(v) && Math.abs(v) < 1e15) return String(v);
      if (S.displayMode === 'FIX') return v.toFixed(S.fixDigits);
      if (S.displayMode === 'SCI') return v.toExponential(S.fixDigits);
      const abs = Math.abs(v);
      if (abs !== 0 && (abs < 1e-9 || abs >= 1e12)) {
        return v.toExponential(9).replace(/\.?0+e/, 'e');
      }
      let s = v.toPrecision(12);
      if (s.indexOf('.') !== -1 && s.indexOf('e') === -1) {
        s = s.replace(/\.?0+$/, '');
      }
      return s;
    }

    /* =====================================================================
       KEY DEFINITIONS
       ===================================================================== */
    const KEYS = [
      // Row 1
      { type:'ctrl', label:'SHIFT', main:'SHIFT', toggle:'shift', action:()=>toggleToggle('shift') },
      { type:'ctrl', label:'ALPHA', main:'ALPHA', toggle:'alpha', action:()=>toggleToggle('alpha') },
      { type:'ctrl', label:'◀', main:'◀', action:()=>moveCursor(-1) },
      { type:'ctrl', label:'▶', main:'▶', action:()=>moveCursor(1) },
      { type:'ctrl', label:'MODE', main:'MODE', action:()=>openSheet('modes') },
      { type:'ctrl', label:'ON', main:'ON', action:()=>{ clearAll(); showToast('Cleared'); } },

      // Row 2
      { type:'fn', label:'x⁻¹', main:'x⁻¹', shiftLabel:'°\'"', action:(m)=>insert(m==='shift' ? '°' : 'x⁻¹') },
      { type:'fn', label:'√', main:'√', shiftLabel:'∛', action:(m)=>insert(m==='shift' ? '∛(' : '√(') },
      { type:'fn', label:'x²', main:'x²', shiftLabel:'x³', action:(m)=>insert(m==='shift' ? '^3' : '^2') },
      { type:'fn', label:'xʸ', main:'xʸ', shiftLabel:'ⁿ√', action:(m)=>insert(m==='shift' ? 'ⁿ√(' : '^') },
      { type:'fn', label:'log', main:'log', shiftLabel:'10ˣ', action:(m)=>insert(m==='shift' ? '10^(' : 'log(') },
      { type:'fn', label:'ln', main:'ln', shiftLabel:'eˣ', action:(m)=>insert(m==='shift' ? 'e^(' : 'ln(') },

      // Row 3
      { type:'fn', label:'(-)', main:'(-)', shiftLabel:'Abs', action:(m)=>insert(m==='shift' ? 'ABS(' : '(-') },
      { type:'fn', label:"°'\"", main:"°'\"", shiftLabel:'→DMS', action:(m)=>{ if(m==='shift') convertToDMS(); else insert('°'); } },
      { type:'fn', label:'HYP', main:'HYP', toggle:'hyp', action:()=>toggleToggle('hyp') },
      { type:'fn', label:'sin', main:'sin', shiftLabel:'sin⁻¹', action:(m)=>{ if(S.hyp){ insert(m==='shift'?'asinh(':'sinh('); } else { insert(m==='shift'?'asin(':'sin('); } } },
      { type:'fn', label:'cos', main:'cos', shiftLabel:'cos⁻¹', action:(m)=>{ if(S.hyp){ insert(m==='shift'?'acosh(':'cosh('); } else { insert(m==='shift'?'acos(':'cos('); } } },
      { type:'fn', label:'tan', main:'tan', shiftLabel:'tan⁻¹', action:(m)=>{ if(S.hyp){ insert(m==='shift'?'atanh(':'tanh('); } else { insert(m==='shift'?'atan(':'tan('); } } },

      // Row 4
      { type:'fn', label:'RCL', main:'RCL', shiftLabel:'STO', action:(m)=>{ if(m==='shift'){ S.storeTarget='pending'; showToast('Choose variable A-F/X/Y/M'); } else { S.recallMode=true; showToast('Recall: choose variable'); } render(); } },
      { type:'fn', label:'ENG', main:'ENG', shiftLabel:'←ENG', action:(m)=>{ S.displayMode = S.displayMode==='SCI'?'NORM':'SCI'; render(); livePreview(); } },
      { type:'op', label:'(', main:'(', shiftLabel:'%', action:(m)=>insert(m==='shift' ? '/100*' : '(') },
      { type:'op', label:')', main:')', shiftLabel:'1/x', action:(m)=>insert(m==='shift' ? '^(-1)' : ')') },
      { type:'fn', label:',', main:',', action:()=>insert(',') },
      { type:'fn', label:'S⇔D', main:'S⇔D', shiftLabel:'DRG', action:(m)=>{ if(m==='shift'){ cycleAngle(); } else { toggleDisplayMode(); } } },

      // Row 5
      { type:'num', label:'7', main:'7', alphaLabel:'A', action:(m)=>handleAlphaNum('7','A',m) },
      { type:'num', label:'8', main:'8', alphaLabel:'B', action:(m)=>handleAlphaNum('8','B',m) },
      { type:'num', label:'9', main:'9', alphaLabel:'C', action:(m)=>handleAlphaNum('9','C',m) },
      { type:'del', label:'DEL', main:'DEL', shiftLabel:'INS', action:()=>delChar() },
      { type:'ac', label:'AC', main:'AC', action:()=>clearAll() },
      { type:'fn', label:'π', main:'π', shiftLabel:'e', action:(m)=>insert(m==='shift' ? 'e' : 'π') },

      // Row 6
      { type:'num', label:'4', main:'4', alphaLabel:'D', action:(m)=>handleAlphaNum('4','D',m) },
      { type:'num', label:'5', main:'5', alphaLabel:'E', action:(m)=>handleAlphaNum('5','E',m) },
      { type:'num', label:'6', main:'6', alphaLabel:'F', action:(m)=>handleAlphaNum('6','F',m) },
      { type:'op', label:'×', main:'×', shiftLabel:'nPr', action:(m)=>insert(m==='shift' ? 'nPr(' : '×') },
      { type:'op', label:'÷', main:'÷', shiftLabel:'nCr', action:(m)=>insert(m==='shift' ? 'nCr(' : '÷') },
      { type:'fn', label:'!', main:'!', shiftLabel:'Ran#', action:(m)=>insert(m==='shift' ? Math.random().toFixed(8) : '!') },

      // Row 7
      { type:'num', label:'1', main:'1', alphaLabel:'X', action:(m)=>handleAlphaNum('1','X',m) },
      { type:'num', label:'2', main:'2', alphaLabel:'Y', action:(m)=>handleAlphaNum('2','Y',m) },
      { type:'num', label:'3', main:'3', alphaLabel:'M', action:(m)=>handleAlphaNum('3','M',m) },
      { type:'op', label:'+', main:'+', shiftLabel:'Pol(', action:(m)=>insert(m==='shift' ? 'Pol(' : '+') },
      { type:'op', label:'−', main:'−', shiftLabel:'Rec(', action:(m)=>insert(m==='shift' ? 'Rec(' : '−') },
      { type:'fn', label:'MOD', main:'MOD', shiftLabel:'GCD', action:(m)=>insert(m==='shift' ? 'GCD(' : ' MOD ') },

      // Row 8
      { type:'num', label:'0', main:'0', alphaLabel:'Ran#', action:(m)=>{ if(m==='alpha'){ insert(Math.random().toFixed(8)); } else insert('0'); } },
      { type:'num', label:'.', main:'.', alphaLabel:'RanInt', action:(m)=>{ if(m==='alpha'){ const a=prompt('RanInt low'); const b=prompt('RanInt high'); if(a!=null&&b!=null) insert(String(Math.floor(Math.random()*(+b-+a+1))+ +a)); } else insert('.'); } },
      { type:'num', label:'EXP', main:'EXP', action:()=>insert('×10^') },
      { type:'fn', label:'Ans', main:'Ans', shiftLabel:'M−', action:(m)=>{ if(m==='shift'){ S.memory -= S.lastAnswer; render(); showToast('M− '+formatResult(S.lastAnswer)); } else insert('Ans'); } },
      { type:'eq', label:'=', main:'=', shiftLabel:'M+', action:(m)=>{ if(m==='shift'){ S.memory += S.lastAnswer; render(); showToast('M+ '+formatResult(S.lastAnswer)); } else evaluateNow(); } },
      { type:'fn', label:'MRC', main:'MRC', shiftLabel:'MC', action:(m)=>{ if(m==='shift'){ S.memory = 0; render(); showToast('Memory cleared'); } else { if(S.memory !== 0){ insert(formatResult(S.memory)); showToast('Recalled: '+formatResult(S.memory)); } else { showToast('Memory empty'); } } } },

      // Row 9 — advanced functions
      { type:'fn', label:'∫', main:'∫dx', shiftLabel:'d/dx', action:(m)=>insert(m==='shift' ? 'd/dx(' : '∫(') },
      { type:'fn', label:'Σ', main:'Σ', shiftLabel:'log□', action:(m)=>{ if(m==='shift'){ const b=prompt('Log base'); if(b) insert('logb('+b+','); } else insert('Σ('); } },
      { type:'fn', label:'a b/c', main:'a b/c', shiftLabel:'→Frac', action:(m)=>{ if(m==='shift'){ convertToFrac(); } else { insert('/'); } } },
      { type:'fn', label:'CONST', main:'CONST', shiftLabel:'CONV', action:(m)=>{ if(m==='shift'){ openConvOverlay(); } else { openConstOverlay(); } } },
      { type:'fn', label:'CALC', main:'CALC', shiftLabel:'SOLVE', action:(m)=>{ if(m==='shift'){ openSolveOverlay(); } else { openCalcOverlay(); } } },
      { type:'fn', label:'OPTN', main:'OPTN', shiftLabel:'SETUP', action:(m)=>{ if(m==='shift'){ openSetupOverlay(); } else { openOptnOverlay(); } } },
    ];

    function handleAlphaNum(num, varName, m){
      if (m === 'alpha'){
        if (S.storeTarget === 'pending'){
          S.variables[varName] = S.lastAnswer;
          S.storeTarget = null;
          S.alpha = false;
          render();
          showToast('Stored → '+varName+' = '+formatResult(S.lastAnswer));
          return;
        }
        if (S.recallMode){
          insert(formatResult(S.variables[varName] || 0));
          S.recallMode = false;
          S.alpha = false;
          render();
          return;
        }
        insert(varName);
        S.alpha = false;
        render();
        return;
      }
      insert(num);
    }

    function toggleToggle(name){
      S[name] = !S[name];
      if (name === 'shift') S.alpha = false;
      if (name === 'alpha') S.shift = false;
      render();
    }

    function clearAll(){
      S.expr = ''; S.result = ''; S.error = null;
      S.shift = false; S.alpha = false; S.hyp = false;
      S.storeTarget = null; S.recallMode = false;
      S.justEvaluated = false;
      render();
    }

    /* =====================================================================
       INPUT HANDLERS
       ===================================================================== */
    function insert(text){
      if (S.justEvaluated && /[0-9.]/.test(text) && !S.shift && !S.alpha){
        S.expr = ''; S.justEvaluated = false;
      } else if (S.justEvaluated){
        S.justEvaluated = false;
      }
      insertText(text);
      if (S.shift || S.alpha){ S.shift = false; S.alpha = false; }
      render();
      livePreview();
    }
    function insertText(text){
      if (S.cursor === -1 || S.cursor >= S.expr.length){
        S.expr += text;
      } else {
        S.expr = S.expr.slice(0, S.cursor) + text + S.expr.slice(S.cursor);
        S.cursor += text.length;
      }
      S.error = null;
    }
    function delChar(){
      if (S.cursor === -1 || S.cursor >= S.expr.length){
        S.expr = S.expr.slice(0, -1);
      } else if (S.cursor > 0){
        S.expr = S.expr.slice(0, S.cursor - 1) + S.expr.slice(S.cursor);
        S.cursor--;
      }
      render();
      livePreview();
    }
    function moveCursor(dir){
      if (S.cursor === -1) S.cursor = S.expr.length;
      S.cursor += dir;
      if (S.cursor < 0) S.cursor = 0;
      if (S.cursor > S.expr.length) S.cursor = -1;
      render();
    }
    function cycleAngle(){
      S.angleMode = S.angleMode === 'DEG' ? 'RAD' : (S.angleMode === 'RAD' ? 'GRA' : 'DEG');
      showToast('Angle: '+S.angleMode);
      render(); livePreview();
    }
    function toggleDisplayMode(){
      S.displayMode = S.displayMode === 'NORM' ? 'FIX' : (S.displayMode === 'FIX' ? 'SCI' : 'NORM');
      showToast('Display: '+S.displayMode);
      render(); livePreview();
    }
    function convertToDMS(){
      const r = fullEval(S.expr);
      if (!r.ok){ S.error = 'Error'; S.result = 'Syntax ERROR'; render(); return; }
      const [d, m, s] = toDMS(r.value);
      S.result = `${d}°${m}'${s.toFixed(2)}"`;
      S.lastAnswer = r.value;
      S.shift = false;
      render();
    }
    function convertToFrac(){
      const r = fullEval(S.expr);
      if (!r.ok){ S.error = 'Error'; S.result = 'Syntax ERROR'; render(); return; }
      const fracStr = formatFraction(r.value);
      S.result = fracStr;
      S.lastAnswer = r.value;
      S.shift = false;
      render();
      showToast('Fraction: ' + fracStr);
    }
    function evaluateNow(){
      const r = fullEval(S.expr);
      if (!r.ok){
        S.error = r.error || 'Syntax Error';
        S.result = 'Syntax ERROR';
        render();
        return;
      }
      const formatted = formatResult(r.value);
      S.history.unshift({ expr: S.expr, result: formatted });
      if (S.history.length > 50) S.history.pop();
      S.result = formatted;
      S.lastAnswer = r.value;
      S.expr = '';
      S.cursor = -1;
      S.shift = false; S.alpha = false; S.hyp = false;
      S.error = null;
      S.justEvaluated = true;
      render();
      if (activeSheetTab === 'history') renderHistory();
      hapticFeedback();
    }
    function livePreview(){
      if (!S.expr){ S.result = ''; S.error = null; render(); return; }
      const r = fullEval(S.expr);
      if (r.ok) { S.result = formatResult(r.value); S.error = null; }
      else { S.result = ''; }
      render();
    }

    /* =====================================================================
       HAPTIC FEEDBACK
       ===================================================================== */
    function hapticFeedback(pattern){
      if (navigator.vibrate){
        navigator.vibrate(pattern || 8);
      }
    }

    /* =====================================================================
       RENDERING
       ===================================================================== */
    const keypad = document.getElementById('keypad');

    function buildKeypad(){
      keypad.innerHTML = '';
      KEYS.forEach((k, idx) => {
        const btn = document.createElement('button');
        let cls = 'key ' + (k.type || '');
        btn.className = cls;
        btn.dataset.idx = idx;
        let html = '';
        if (k.shiftLabel) html += `<span class="shift-label">${k.shiftLabel}</span>`;
        if (k.alphaLabel) html += `<span class="alpha-label">${k.alphaLabel}</span>`;
        html += `<span class="main">${k.main}</span>`;
        btn.innerHTML = html;

        // Touch handling with haptic
        let touchTimer = null;
        let longPressed = false;
        let lastTouchTime = 0;

        const fire = () => {
          const m = S.shift ? 'shift' : (S.alpha ? 'alpha' : 'main');
          hapticFeedback();
          try { k.action(m); } catch(err){ console.error(err); }
          // Auto-clear shift/alpha after non-toggle actions
          if (!k.toggle && (S.shift || S.alpha)){
            S.shift = false; S.alpha = false;
            render();
          }
        };

        btn.addEventListener('touchstart', (e) => {
          hapticFeedback(5);
          btn.classList.add('pressed');
          if (k.shiftLabel){
            touchTimer = setTimeout(() => {
              longPressed = true;
              showLongHint(btn, k.shiftLabel);
            }, 500);
          }
        }, { passive: true });

        btn.addEventListener('touchend', (e) => {
          e.preventDefault();
          btn.classList.remove('pressed');
          if (touchTimer){ clearTimeout(touchTimer); touchTimer = null; }
          hideLongHint();
          if (!longPressed){
            fire();
          }
          longPressed = false;
          lastTouchTime = Date.now();
        });

        btn.addEventListener('touchmove', () => {
          if (touchTimer){ clearTimeout(touchTimer); touchTimer = null; }
          btn.classList.remove('pressed');
          hideLongHint();
          longPressed = true;
        });

        // Mouse / programmatic click (skip if it just came from a touch)
        btn.addEventListener('click', (e) => {
          if (Date.now() - lastTouchTime < 500) return; // skip touch-synthesized click
          fire();
        });

        keypad.appendChild(btn);
      });
    }

    function showLongHint(btn, text){
      const hint = document.getElementById('longHint');
      const rect = btn.getBoundingClientRect();
      hint.textContent = text;
      hint.style.left = (rect.left + rect.width/2 - hint.offsetWidth/2) + 'px';
      hint.style.top = (rect.top - 30) + 'px';
      hint.classList.add('show');
    }
    function hideLongHint(){
      document.getElementById('longHint').classList.remove('show');
    }

    function render(){
      const inputEl = document.getElementById('inputExpr');
      const resultEl = document.getElementById('resultLine');

      let display = S.expr || '';
      display = display
        .replace(/\*\*/g, '^')
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/<=/g, '≤');

      if (S.cursor === -1 || S.cursor >= S.expr.length){
        if (display){
          inputEl.innerHTML = escapeHtml(display) + '<span class="cursor"></span>';
        } else {
          inputEl.innerHTML = '<span class="cursor"></span>';
        }
      } else {
        const left = display.slice(0, S.cursor);
        const right = display.slice(S.cursor);
        inputEl.innerHTML = escapeHtml(left) + '<span class="cursor"></span>' + escapeHtml(right);
      }

      if (S.error){
        resultEl.textContent = S.result || 'Syntax ERROR';
        resultEl.className = 'result-line error';
      } else if (S.result){
        resultEl.textContent = S.result;
        resultEl.className = 'result-line';
      } else {
        resultEl.textContent = 'Result';
        resultEl.className = 'result-line placeholder';
      }

      // Indicators
      document.getElementById('ind-angle').textContent = S.angleMode;
      document.getElementById('ind-mode').textContent = S.mode;
      document.getElementById('ind-shift').classList.toggle('on', S.shift);
      document.getElementById('ind-alpha').classList.toggle('on', S.alpha);
      document.getElementById('ind-hyp').classList.toggle('on', S.hyp);
      document.getElementById('ind-mem').classList.toggle('on', S.memory !== 0);
      document.getElementById('ind-sto').classList.toggle('on', S.storeTarget === 'pending');
      const dispInd = document.getElementById('ind-disp');
      dispInd.textContent = S.displayMode === 'NORM' ? '' : S.displayMode;
      dispInd.classList.toggle('on', S.displayMode !== 'NORM');
      document.getElementById('ind-err').classList.toggle('on', !!S.error);

      // Update toggle keys
      document.querySelectorAll('#keypad .key').forEach((btn, i) => {
        const k = KEYS[i];
        if (k.toggle){
          btn.classList.toggle('active-toggle', !!S[k.toggle]);
        }
      });
    }

    function escapeHtml(s){
      return String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/ /g,'&nbsp;');
    }

    /* =====================================================================
       BOTTOM SHEET
       ===================================================================== */
    let activeSheetTab = 'history';

    document.getElementById('btnHistory').addEventListener('click', () => openSheet('history'));
    document.getElementById('btnModes').addEventListener('click', () => openSheet('modes'));
    document.getElementById('btnHelp').addEventListener('click', () => openSheet('help'));
    document.getElementById('closeSheet').addEventListener('click', closeSheet);
    document.getElementById('sheetBackdrop').addEventListener('click', closeSheet);
    document.querySelectorAll('.sheet-tab').forEach(t => {
      t.addEventListener('click', () => switchSheetTab(t.dataset.stab));
    });

    function openSheet(tab){
      switchSheetTab(tab);
      document.getElementById('bottomSheet').classList.add('show');
      document.getElementById('sheetBackdrop').classList.add('show');
    }
    function closeSheet(){
      document.getElementById('bottomSheet').classList.remove('show');
      document.getElementById('sheetBackdrop').classList.remove('show');
    }
    function switchSheetTab(name){
      activeSheetTab = name;
      document.querySelectorAll('.sheet-tab').forEach(t => t.classList.toggle('active', t.dataset.stab === name));
      const titles = { history:'Calculation History', modes:'Calculator Modes', help:'Help & Shortcuts' };
      document.getElementById('sheetTitle').textContent = titles[name];
      if (name === 'history') renderHistory();
      else if (name === 'modes') renderModes();
      else if (name === 'help') renderHelp();
    }

    function renderHistory(){
      if (activeSheetTab !== 'history') return;
      const c = document.getElementById('sheetContent');
      if (!S.history.length){
        c.innerHTML = `
          <div class="history-empty">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
            <div>No calculations yet</div>
            <div style="margin-top:6px;font-size:11px;opacity:0.7;">Tap = to evaluate an expression</div>
          </div>`;
        return;
      }
      c.innerHTML = '';
      S.history.forEach((h, i) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<div class="h-expr">${escapeHtml(h.expr)}</div><div class="h-res">${escapeHtml(h.result)}</div>`;
        div.addEventListener('click', () => {
          S.expr = h.expr;
          S.cursor = -1;
          S.justEvaluated = false;
          closeSheet();
          render();
          livePreview();
        });
        c.appendChild(div);
      });
    }

    const MODES = [
      { id:'COMP',    name:'COMP',     desc:'Standard scientific computation', icon:'COMP' },
      { id:'BASE-N',  name:'BASE-N',   desc:'Binary / Octal / Decimal / Hex', icon:'BASE' },
      { id:'STAT',    name:'STAT',     desc:'Statistics — mean, stddev, sum, regression', icon:'STAT' },
      { id:'COMPLEX', name:'COMPLEX',  desc:'Complex number arithmetic & functions', icon:'a+bi' },
      { id:'TABLE',   name:'TABLE',    desc:'Generate f(x) value tables', icon:'f(x)' },
      { id:'EQN',     name:'EQN',      desc:'Solve linear, quadratic, cubic equations', icon:'EQN' },
      { id:'MATRIX',  name:'MATRIX',   desc:'Matrix A/B/C, Det, inverse, transpose', icon:'[A]' },
      { id:'VECTOR',  name:'VECTOR',   desc:'Vector A/B/C, dot, cross product', icon:'→' },
    ];

    function renderModes(){
      if (activeSheetTab !== 'modes') return;
      const c = document.getElementById('sheetContent');
      let html = '<div class="mode-list-title">Calculator Mode</div><div class="mode-list">';
      MODES.forEach(m => {
        html += `<div class="mode-row ${S.mode===m.id?'active':''}" data-mode="${m.id}">
          <div class="m-icon">${m.icon}</div>
          <div class="m-text">
            <div class="m-name">${m.name}</div>
            <div class="m-desc">${m.desc}</div>
          </div>
        </div>`;
      });
      html += '</div>';

      html += '<div class="mode-list-title" style="margin-top:16px;">Angle Mode</div><div class="mode-list">';
      [['DEG','Degrees','DEG'],['RAD','Radians','RAD'],['GRA','Gradians','GRA']].forEach(([id,name,icon]) => {
        html += `<div class="mode-row ${S.angleMode===id?'active':''}" data-ang="${id}">
          <div class="m-icon">${icon}</div>
          <div class="m-text">
            <div class="m-name">${name}</div>
          </div>
        </div>`;
      });
      html += '</div>';

      html += '<div class="mode-list-title" style="margin-top:16px;">Display Format</div>';
      html += `<div class="setting-group">
        <div class="setting-row">
          <span class="setting-label">Format</span>
          <div class="seg-control">
            <button data-d="NORM" class="${S.displayMode==='NORM'?'active':''}">NORM</button>
            <button data-d="FIX" class="${S.displayMode==='FIX'?'active':''}">FIX</button>
            <button data-d="SCI" class="${S.displayMode==='SCI'?'active':''}">SCI</button>
          </div>
        </div>
        <div class="setting-row">
          <span class="setting-label">Decimal places</span>
          <div class="seg-control">
            ${[2,4,6,8].map(n => `<button data-fix="${n}" class="${S.fixDigits===n?'active':''}">${n}</button>`).join('')}
          </div>
        </div>
      </div>`;

      html += '<div class="mode-list-title" style="margin-top:16px;">Memory & Variables</div>';
      html += `<div class="setting-group">
        <div class="setting-row"><span class="setting-label">M (memory)</span><span class="setting-value">${formatResult(S.memory)}</span></div>
        <div class="setting-row"><span class="setting-label">Ans (last)</span><span class="setting-value">${formatResult(S.lastAnswer)}</span></div>
        ${Object.entries(S.variables).filter(([k])=>k!=='M').map(([k,v])=>
          `<div class="setting-row"><span class="setting-label">${k}</span><span class="setting-value">${formatResult(v)}</span></div>`
        ).join('')}
      </div>
      <button class="ov-btn ghost" id="clearMemBtn" style="width:100%;margin-top:8px;">Clear Memory & Variables</button>`;

      c.innerHTML = html;

      // Bind events
      c.querySelectorAll('[data-mode]').forEach(el => {
        el.addEventListener('click', () => setMode(el.dataset.mode));
      });
      c.querySelectorAll('[data-ang]').forEach(el => {
        el.addEventListener('click', () => { S.angleMode = el.dataset.ang; renderModes(); render(); livePreview(); });
      });
      c.querySelectorAll('[data-d]').forEach(el => {
        el.addEventListener('click', () => { S.displayMode = el.dataset.d; renderModes(); render(); livePreview(); });
      });
      c.querySelectorAll('[data-fix]').forEach(el => {
        el.addEventListener('click', () => { S.fixDigits = parseInt(el.dataset.fix,10); renderModes(); render(); livePreview(); });
      });
      document.getElementById('clearMemBtn').addEventListener('click', () => {
        S.memory = 0; S.lastAnswer = 0;
        Object.keys(S.variables).forEach(k => S.variables[k] = 0);
        showToast('All memory cleared');
        renderModes(); render();
      });
    }

    function renderHelp(){
      if (activeSheetTab !== 'help') return;
      const c = document.getElementById('sheetContent');
      c.innerHTML = `
        <div class="help-section">
          <h4>Quick Guide</h4>
          <ul>
            <li><code>SHIFT</code> + key → activate yellow (2nd) function</li>
            <li><code>ALPHA</code> + key → input variable or constant</li>
            <li><code>HYP</code> + <code>sin/cos/tan</code> → hyperbolic functions</li>
            <li><code>S⇔D</code> → toggle NORM/FIX/SCI display</li>
            <li><code>SHIFT</code> + <code>S⇔D</code> → cycle DEG/RAD/GRA</li>
            <li>Long-press any key with yellow label → see SHIFT function</li>
          </ul>
        </div>
        <div class="help-section">
          <h4>Memory Operations</h4>
          <ul>
            <li><code>SHIFT</code> + <code>=</code> → add result to memory (M+)</li>
            <li><code>SHIFT</code> + <code>Ans</code> → subtract from memory (M−)</li>
            <li><code>SHIFT</code> + <code>MRC</code> → clear memory (MC)</li>
            <li><code>SHIFT</code> + <code>RCL</code> → store Ans to variable</li>
            <li><code>RCL</code> + variable letter → recall variable</li>
          </ul>
        </div>
        <div class="help-section">
          <h4>Supported Functions</h4>
          <ul>
            <li>Trig: <code>sin cos tan</code> + inverses (SHIFT)</li>
            <li>Hyperbolic: <code>sinh cosh tanh</code> and reciprocal/inverse forms</li>
            <li>Reciprocal trig: <code>sec csc cot</code> and inverses</li>
            <li>Logs: <code>log</code> (base 10), <code>ln</code> (natural), <code>log2</code>, <code>logb</code></li>
            <li>Numeric helpers: <code>floor ceil round sign min max hypot</code></li>
            <li>Powers: <code>x² x³ xʸ √ ³√ ⁿ√</code></li>
            <li>Constants: <code>π</code> (3.14159…), <code>e</code> (2.71828…)</li>
            <li>Combinatorics: <code>n!</code> <code>nPr(</code> <code>nCr(</code></li>
            <li>Number theory: <code>MOD GCD LCM</code></li>
            <li>Coordinate: <code>Pol(r,θ)</code> <code>Rec(x,y)</code></li>
            <li>DMS: type <code>12°30'56"</code> for degrees-minutes-seconds</li>
            <li>Absolute value: <code>Abs(</code> via SHIFT+(-)</li>
          </ul>
        </div>
        <div class="help-section">
          <h4>Keyboard Shortcuts</h4>
          <ul>
            <li><code>0-9 . + - * /</code> → direct input</li>
            <li><code>Enter</code> → evaluate (=)</li>
            <li><code>Backspace</code> → delete last char</li>
            <li><code>Escape</code> → clear all (AC)</li>
            <li><code>^</code> → power, <code>(</code> <code>)</code> → parentheses</li>
            <li><code>s c t</code> → sin( cos( tan(</li>
            <li><code>l</code> → log(, <code>n</code> → ln(</li>
            <li><code>q</code> → sqrt(, <code>r</code> → ^2</li>
            <li><code>p</code> → π, <code>e</code> → e</li>
            <li><code>!</code> → factorial</li>
          </ul>
        </div>
        <div class="help-section">
          <h4>Advanced Modes</h4>
          <ul>
            <li><code>STAT</code> → enter data list, get mean/sum/stddev</li>
            <li><code>BASE-N</code> → convert between BIN/OCT/DEC/HEX</li>
            <li><code>COMPLEX</code> → arithmetic with a+bi form</li>
            <li><code>TABLE</code> → generate table of f(x) values</li>
            <li><code>EQN</code> → solve linear & quadratic equations</li>
          </ul>
        </div>
      `;
    }

    /* =====================================================================
       MODE SWITCHING + OVERLAYS
       ===================================================================== */
    function setMode(mode){
      S.mode = mode;
      S.expr = ''; S.result = ''; S.error = null;
      S.justEvaluated = false;
      render();
      if (activeSheetTab === 'modes') renderModes();
      closeSheet();
      if (mode === 'STAT') openStatOverlay();
      else if (mode === 'BASE-N') openBaseNOverlay();
      else if (mode === 'COMPLEX') openComplexOverlayExpanded();
      else if (mode === 'TABLE') openTableOverlay();
      else if (mode === 'EQN') openEqnOverlay();
      else if (mode === 'MATRIX') openMatrixOverlay();
      else if (mode === 'VECTOR') openVectorOverlay();
    }

    function openOverlay(title, contentHTML){
      const box = document.getElementById('overlayBox');
      box.innerHTML = `<h3>${title}</h3>${contentHTML}
        <div class="ov-row" style="margin-top:14px; justify-content:flex-end;">
          <button class="ov-btn ghost" onclick="closeOverlay()">Close</button>
        </div>`;
      document.getElementById('overlay').classList.add('show');
    }
    function closeOverlay(){
      document.getElementById('overlay').classList.remove('show');
    }
    window.closeOverlay = closeOverlay;

    document.getElementById('overlay').addEventListener('click', (e) => {
      if (e.target.id === 'overlay') closeOverlay();
    });

    /* ----- STAT ----- */
    function openStatOverlay(){
      openOverlay('STAT Mode — Statistics & Regression', `
        <div class="ov-section">Mode</div>
        <div class="seg-control" style="margin-bottom:8px;">
          <button class="stat-mode active" data-sm="1var">1-VAR</button>
          <button class="stat-mode" data-sm="lin">LinReg</button>
          <button class="stat-mode" data-sm="log">LogReg</button>
          <button class="stat-mode" data-sm="exp">ExpReg</button>
          <button class="stat-mode" data-sm="pow">PwrReg</button>
          <button class="stat-mode" data-sm="inv">InvReg</button>
          <button class="stat-mode" data-sm="quad">QuadReg</button>
        </div>
        <div class="ov-section">Data Input</div>
        <p style="color:var(--text-dim);font-size:11px;margin-bottom:8px;">1-VAR: enter x values. REG: enter "x,y" pairs (one per line).</p>
        <textarea id="statData" placeholder="1-VAR: 12, 15, 18\nREG: 1,2\\n3,5\\n5,8"></textarea>
        <div class="ov-row">
          <button class="ov-btn" id="statCalc">Calculate</button>
          <button class="ov-btn ghost" id="statClear">Clear</button>
        </div>
        <div class="ov-result" id="statResult">Results will appear here.</div>
        <div class="ov-section" id="estSection" style="display:none;">Estimation</div>
        <div class="ov-row" id="estRow" style="display:none;">
          <input id="estX" placeholder="x value" />
          <button class="ov-btn ghost" id="estY">Estimate ŷ</button>
        </div>
      `);
      let statMode = '1var';
      let lastReg = null;
      document.querySelectorAll('#overlayBox .stat-mode').forEach(b => {
        b.onclick = () => {
          statMode = b.dataset.sm;
          document.querySelectorAll('#overlayBox .stat-mode').forEach(x => x.classList.toggle('active', x === b));
          const isReg = statMode !== '1var';
          document.getElementById('estSection').style.display = isReg ? '' : 'none';
          document.getElementById('estRow').style.display = isReg ? '' : 'none';
        };
      });
      document.getElementById('statCalc').onclick = () => {
        const txt = document.getElementById('statData').value;
        if (statMode === '1var'){
          const arr = txt.split(/[,\s\n]+/).map(s => parseFloat(s)).filter(v => !isNaN(v));
          if (!arr.length){ document.getElementById('statResult').textContent = 'No valid data.'; return; }
          const n = arr.length;
          const sum = arr.reduce((a,b)=>a+b, 0);
          const mean = sum / n;
          const sumSq = arr.reduce((a,b)=>a+b*b, 0);
          const varPop = sumSq/n - mean*mean;
          const varSamp = n>1 ? (sumSq - n*mean*mean)/(n-1) : 0;
          const stdPop = Math.sqrt(Math.max(0,varPop));
          const stdSamp = Math.sqrt(Math.max(0,varSamp));
          const sorted = [...arr].sort((a,b)=>a-b);
          const min = sorted[0], max = sorted[n-1];
          const median = n%2 ? sorted[(n-1)/2] : (sorted[n/2-1]+sorted[n/2])/2;
          const q1 = sorted[Math.floor((n-1)/4)];
          const q3 = sorted[Math.floor(3*(n-1)/4)];
          document.getElementById('statResult').textContent =
    `n         = ${n}
    Σx        = ${formatResult(sum)}
    Σx²       = ${formatResult(sumSq)}
    mean x̄    = ${formatResult(mean)}
    min       = ${formatResult(min)}
    Q1        = ${formatResult(q1)}
    median    = ${formatResult(median)}
    Q3        = ${formatResult(q3)}
    max       = ${formatResult(max)}
    σ (pop)   = ${formatResult(stdPop)}
    s (samp)  = ${formatResult(stdSamp)}
    var(pop)  = ${formatResult(varPop)}
    var(samp) = ${formatResult(varSamp)}`;
          return;
        }
        // Regression modes
        const pairs = txt.split('\n').map(line => {
          const parts = line.split(/[,\s]+/).map(s => parseFloat(s));
          return { x: parts[0], y: parts[1] };
        }).filter(p => !isNaN(p.x) && !isNaN(p.y));
        if (pairs.length < 2){ document.getElementById('statResult').textContent = 'Need at least 2 (x,y) pairs.'; return; }
        const n = pairs.length;
        let X, Y;
        if (statMode === 'lin'){ X = pairs.map(p=>p.x); Y = pairs.map(p=>p.y); }
        else if (statMode === 'log'){ X = pairs.map(p=>Math.log(p.x)); Y = pairs.map(p=>p.y); }
        else if (statMode === 'exp'){ X = pairs.map(p=>p.x); Y = pairs.map(p=>Math.log(p.y)); }
        else if (statMode === 'pow'){ X = pairs.map(p=>Math.log(p.x)); Y = pairs.map(p=>Math.log(p.y)); }
        else if (statMode === 'inv'){ X = pairs.map(p=>1/p.x); Y = pairs.map(p=>p.y); }
        else if (statMode === 'quad'){
          // Quadratic regression: y = a + bx + cx²
          const sX = pairs.reduce((s,p)=>s+p.x,0);
          const sX2 = pairs.reduce((s,p)=>s+p.x*p.x,0);
          const sX3 = pairs.reduce((s,p)=>s+p.x*p.x*p.x,0);
          const sX4 = pairs.reduce((s,p)=>s+p.x*p.x*p.x*p.x,0);
          const sY = pairs.reduce((s,p)=>s+p.y,0);
          const sXY = pairs.reduce((s,p)=>s+p.x*p.y,0);
          const sX2Y = pairs.reduce((s,p)=>s+p.x*p.x*p.y,0);
          const D = n*(sX2*sX4 - sX3*sX3) - sX*(sX*sX4 - sX2*sX3) + sX2*(sX*sX3 - sX2*sX2);
          if (Math.abs(D) < 1e-14){ document.getElementById('statResult').textContent = 'Singular'; return; }
          const a = (sY*(sX2*sX4 - sX3*sX3) - sX*(sXY*sX4 - sX2*sX2Y) + sX2*(sXY*sX3 - sX2*sXY))/D;
          const b = (n*(sXY*sX4 - sX2*sX2Y) - sY*(sX*sX4 - sX2*sX3) + sX2*(sX*sX2Y - sXY*sX2))/D;
          const c = (n*(sX2*sX2Y - sXY*sX3) - sX*(sX*sX2Y - sXY*sX2) + sY*(sX*sX3 - sX2*sX2))/D;
          lastReg = { type:'quad', a, b, c };
          // Compute correlation coefficient r
          const yMean = sY/n;
          let ssTot = 0, ssRes = 0;
          for (const p of pairs){
            const yp = a + b*p.x + c*p.x*p.x;
            ssTot += (p.y - yMean)**2;
            ssRes += (p.y - yp)**2;
          }
          const r2 = ssTot > 0 ? 1 - ssRes/ssTot : 1;
          const r = Math.sqrt(Math.max(0, r2));
          document.getElementById('statResult').textContent =
    `QUADRATIC REGRESSION
    y = a + b·x + c·x²
    a = ${formatResult(a)}
    b = ${formatResult(b)}
    c = ${formatResult(c)}
    r = ${formatResult(r)}
    r² = ${formatResult(r2)}
    n = ${n}`;
          return;
        }
        // Linear regression on transformed data: y = A + Bx
        const sx = X.reduce((a,b)=>a+b,0);
        const sy = Y.reduce((a,b)=>a+b,0);
        const sxy = X.reduce((s,v,i)=>s+v*Y[i],0);
        const sxx = X.reduce((s,v)=>s+v*v,0);
        const syy = Y.reduce((s,v)=>s+v*v,0);
        const mx = sx/n, my = sy/n;
        const Sxx = sxx - n*mx*mx;
        const Syy = syy - n*my*my;
        const Sxy = sxy - n*mx*my;
        const B = Sxy/Sxx;
        const A = my - B*mx;
        const r = Sxy/Math.sqrt(Sxx*Syy);
        // Convert back to original form
        let origA, origB, formula;
        if (statMode === 'lin'){ origA = A; origB = B; formula = `y = ${formatResult(origA)} + ${formatResult(origB)}·x`; }
        else if (statMode === 'log'){ origA = A; origB = B; formula = `y = ${formatResult(origA)} + ${formatResult(origB)}·ln(x)`; }
        else if (statMode === 'exp'){ origA = Math.exp(A); origB = Math.exp(B); formula = `y = ${formatResult(origA)}·e^(${formatResult(Math.log(origB))}·x) ≈ ${formatResult(origA)}·${formatResult(origB)}^x`; }
        else if (statMode === 'pow'){ origA = Math.exp(A); origB = B; formula = `y = ${formatResult(origA)}·x^${formatResult(origB)}`; }
        else if (statMode === 'inv'){ origA = A; origB = B; formula = `y = ${formatResult(origA)} + ${formatResult(origB)}/x`; }
        lastReg = { type:statMode, A:origA, B:origB, rawA:A, rawB:B, r };
        document.getElementById('statResult').textContent =
    `${statMode.toUpperCase()} REGRESSION
    ${formula}
    A = ${formatResult(origA)}
    B = ${formatResult(origB)}
    r = ${formatResult(r)}
    r² = ${formatResult(r*r)}
    n = ${n}
    Σx = ${formatResult(pairs.reduce((s,p)=>s+p.x,0))}
    Σy = ${formatResult(pairs.reduce((s,p)=>s+p.y,0))}
    Σxy = ${formatResult(pairs.reduce((s,p)=>s+p.x*p.y,0))}
    mean x̄ = ${formatResult(pairs.reduce((s,p)=>s+p.x,0)/n)}
    mean ȳ = ${formatResult(pairs.reduce((s,p)=>s+p.y,0)/n)}`;
      };
      document.getElementById('estY').onclick = () => {
        if (!lastReg){ return; }
        const x = parseFloat(document.getElementById('estX').value);
        if (isNaN(x)){ return; }
        let y;
        if (lastReg.type === 'lin') y = lastReg.A + lastReg.B*x;
        else if (lastReg.type === 'log') y = lastReg.A + lastReg.B*Math.log(x);
        else if (lastReg.type === 'exp') y = lastReg.A * Math.exp(Math.log(lastReg.B)*x);
        else if (lastReg.type === 'pow') y = lastReg.A * Math.pow(x, lastReg.B);
        else if (lastReg.type === 'inv') y = lastReg.A + lastReg.B/x;
        else if (lastReg.type === 'quad') y = lastReg.a + lastReg.b*x + lastReg.c*x*x;
        document.getElementById('statResult').textContent = `ŷ(${x}) = ${formatResult(y)}`;
      };
      document.getElementById('statClear').onclick = () => {
        document.getElementById('statData').value = '';
        document.getElementById('statResult').textContent = 'Results will appear here.';
      };
    }

    /* ----- BASE-N ----- */
    function openBaseNOverlay(){
      openOverlay('BASE-N — Number Base Conversion & Logic', `
        <div class="ov-section">Base Conversion</div>
        <div class="ov-row">
          <select id="bnBase" style="max-width:160px;flex:0 0 auto;">
            <option value="2">BIN (base 2)</option>
            <option value="8">OCT (base 8)</option>
            <option value="10" selected>DEC (base 10)</option>
            <option value="16">HEX (base 16)</option>
          </select>
          <input id="bnInput" placeholder="e.g. 255" />
          <button class="ov-btn" id="bnCalc">Convert</button>
        </div>
        <div class="ov-result" id="bnResult">Conversion result will appear here.</div>
        <div class="ov-section">Logical Operations</div>
        <div class="ov-row">
          <input id="bnA" placeholder="A (decimal)" style="max-width:120px;" />
          <input id="bnB" placeholder="B (decimal)" style="max-width:120px;" />
        </div>
        <div class="ov-row" style="flex-wrap:wrap;">
          <button class="ov-btn" data-lop="and">A AND B</button>
          <button class="ov-btn" data-lop="or">A OR B</button>
          <button class="ov-btn" data-lop="xor">A XOR B</button>
          <button class="ov-btn" data-lop="xnor">A XNOR B</button>
          <button class="ov-btn ghost" data-lop="not">NOT A</button>
          <button class="ov-btn ghost" data-lop="neg">Neg(A)</button>
        </div>
        <div class="ov-result" id="bnLogicResult">Logic result will appear here.</div>
      `);
      document.getElementById('bnCalc').onclick = () => {
        const base = parseInt(document.getElementById('bnBase').value, 10);
        const txt = document.getElementById('bnInput').value.trim();
        if (!txt){ document.getElementById('bnResult').textContent = 'No input.'; return; }
        let v;
        try { v = parseInt(txt, base); if (isNaN(v)) throw 0; }
        catch(e){ document.getElementById('bnResult').textContent = 'Invalid input for base ' + base; return; }
        const neg = v < 0; v = Math.abs(v);
        document.getElementById('bnResult').textContent =
    `BIN : ${neg?'-':''}${v.toString(2)}
    OCT : ${neg?'-':''}${v.toString(8)}
    DEC : ${neg?'-':''}${v.toString(10)}
    HEX : ${neg?'-':''}${v.toString(16).toUpperCase()}`;
      };
      document.querySelectorAll('#overlayBox [data-lop]').forEach(b => {
        b.onclick = () => {
          const op = b.dataset.lop;
          const aVal = parseInt(document.getElementById('bnA').value, 10);
          const bVal = parseInt(document.getElementById('bnB').value, 10);
          let res;
          try {
            if (op === 'and'){ if (isNaN(aVal)||isNaN(bVal)) throw new Error('Enter A and B'); res = logAnd(aVal, bVal); }
            else if (op === 'or'){ if (isNaN(aVal)||isNaN(bVal)) throw new Error('Enter A and B'); res = logOr(aVal, bVal); }
            else if (op === 'xor'){ if (isNaN(aVal)||isNaN(bVal)) throw new Error('Enter A and B'); res = logXor(aVal, bVal); }
            else if (op === 'xnor'){ if (isNaN(aVal)||isNaN(bVal)) throw new Error('Enter A and B'); res = logXnor(aVal, bVal); }
            else if (op === 'not'){ if (isNaN(aVal)) throw new Error('Enter A'); res = logNot(aVal); }
            else if (op === 'neg'){ if (isNaN(aVal)) throw new Error('Enter A'); res = logNeg(aVal); }
            document.getElementById('bnLogicResult').textContent =
    `Result:
    BIN : ${res.toString(2)}
    OCT : ${res.toString(8)}
    DEC : ${res.toString(10)}
    HEX : ${res.toString(16).toUpperCase()}`;
          } catch(e){ document.getElementById('bnLogicResult').textContent = 'Error: ' + e.message; }
        };
      });
    }

    /* ----- COMPLEX ----- */
    function openComplexOverlay(){
      openOverlay('COMPLEX — Complex Number Arithmetic', `
        <div class="ov-section">Complex Numbers (a+bi form)</div>
        <div class="ov-row">
          <input id="cxA" placeholder="3+4i" />
          <input id="cxB" placeholder="1-2i" />
        </div>
        <div class="ov-row">
          <button class="ov-btn" data-op="add">a + b</button>
          <button class="ov-btn" data-op="sub">a − b</button>
          <button class="ov-btn" data-op="mul">a × b</button>
          <button class="ov-btn" data-op="div">a ÷ b</button>
        </div>
        <div class="ov-row">
          <button class="ov-btn ghost" data-op="abs">|a|</button>
          <button class="ov-btn ghost" data-op="conj">conj(a)</button>
          <button class="ov-btn ghost" data-op="arg">arg(a)</button>
        </div>
        <div class="ov-result" id="cxResult">Results will appear here.</div>
      `);
      const parseCx = (s) => {
        s = s.trim().replace(/\s/g,'').replace(/i/g,'j').replace(/j$/,'');
        const m2 = s.match(/^(-?\d+(?:\.\d+)?(?:e-?\d+)?)j$/);
        const m3 = s.match(/^(-?\d+(?:\.\d+)?)$/);
        const m = s.match(/^(-?\d+(?:\.\d+)?(?:e-?\d+)?)\+?(-?)?(\d+(?:\.\d+)?)?j?$/);
        if (m2) return {re:0, im:parseFloat(m2[1])};
        if (m3) return {re:parseFloat(m3[1]), im:0};
        if (m){
          const re = parseFloat(m[1]);
          const im = m[3] ? (m[2]==='-'?-1:1)*parseFloat(m[3]) : 0;
          return {re, im};
        }
        return null;
      };
      const fmt = (c) => {
        const re = formatResult(c.re);
        const im = formatResult(Math.abs(c.im));
        if (Math.abs(c.im) < 1e-12) return re;
        if (Math.abs(c.re) < 1e-12) return im + 'i';
        return `${re} ${c.im>=0?'+':'−'} ${im}i`;
      };
      document.querySelectorAll('#overlayBox [data-op]').forEach(b => {
        b.onclick = () => {
          const a = parseCx(document.getElementById('cxA').value);
          const bV = parseCx(document.getElementById('cxB').value);
          if (!a){ document.getElementById('cxResult').textContent = 'Invalid first number'; return; }
          const op = b.dataset.op;
          let res;
          if (op === 'add'){ if(!bV)return; res = {re:a.re+bV.re, im:a.im+bV.im}; }
          else if (op === 'sub'){ if(!bV)return; res = {re:a.re-bV.re, im:a.im-bV.im}; }
          else if (op === 'mul'){ if(!bV)return; res = {re:a.re*bV.re-a.im*bV.im, im:a.re*bV.im+a.im*bV.re}; }
          else if (op === 'div'){
            if(!bV)return;
            const d = bV.re*bV.re + bV.im*bV.im;
            if (Math.abs(d) < 1e-15){ document.getElementById('cxResult').textContent='Divide by zero'; return; }
            res = {re:(a.re*bV.re + a.im*bV.im)/d, im:(a.im*bV.re - a.re*bV.im)/d};
          }
          else if (op === 'abs'){ res = {re:Math.hypot(a.re,a.im), im:0}; }
          else if (op === 'conj'){ res = {re:a.re, im:-a.im}; }
          else if (op === 'arg'){ res = {re:fromRad(Math.atan2(a.im,a.re)), im:0}; }
          document.getElementById('cxResult').textContent = `= ${fmt(res)}`;
        };
      });
    }

    /* ----- TABLE ----- */
    function openTableOverlay(){
      openOverlay('TABLE — Generate f(x) Table', `
        <div class="ov-section">Function & Range</div>
        <p style="color:var(--text-dim);font-size:11px;margin-bottom:8px;">Use X as the variable. Standard syntax applies.</p>
        <input id="tbExpr" placeholder="e.g. sin(X)+X^2" style="width:100%;"/>
        <div class="ov-row" style="margin-top:8px;">
          <input id="tbStart" placeholder="Start: -5" />
          <input id="tbEnd" placeholder="End: 5" />
          <input id="tbStep" placeholder="Step: 1" />
        </div>
        <div class="ov-row"><button class="ov-btn" id="tbGen">Generate Table</button></div>
        <div class="ov-result" id="tbResult">Table will appear here.</div>
      `);
      document.getElementById('tbGen').onclick = () => {
        const expr = document.getElementById('tbExpr').value;
        const start = parseFloat(document.getElementById('tbStart').value || '-5');
        const end = parseFloat(document.getElementById('tbEnd').value || '5');
        const step = parseFloat(document.getElementById('tbStep').value || '1');
        if (!expr){ document.getElementById('tbResult').textContent = 'No expression.'; return; }
        let out = '  X        f(X)\n' + '─'.repeat(22) + '\n';
        for (let x = start; x <= end + 1e-9; x += step){
          const sub = expr.replace(/\bX\b/g, '(' + x + ')');
          const r = fullEval(sub);
          const v = r.ok ? formatResult(r.value) : 'ERR';
          out += String(x).padStart(6) + '   ' + String(v).padStart(12) + '\n';
        }
        document.getElementById('tbResult').textContent = out;
      };
    }

    /* ----- EQN ----- */
    function openEqnOverlay(){
      openOverlay('EQN — Equation Solver', `
        <div class="ov-section">Linear: aX + b = c</div>
        <div class="ov-row">
          <input id="linA" placeholder="a" />
          <input id="linB" placeholder="b" />
          <input id="linC" placeholder="c" />
          <button class="ov-btn" id="linSolve">Solve X</button>
        </div>
        <div class="ov-section">Quadratic: aX² + bX + c = 0</div>
        <div class="ov-row">
          <input id="qdA" placeholder="a" />
          <input id="qdB" placeholder="b" />
          <input id="qdC" placeholder="c" />
          <button class="ov-btn" id="qdSolve">Solve</button>
        </div>
        <div class="ov-section">Cubic: aX³ + bX² + cX + d = 0</div>
        <div class="ov-row">
          <input id="cbA" placeholder="a" />
          <input id="cbB" placeholder="b" />
          <input id="cbC" placeholder="c" />
          <input id="cbD" placeholder="d" />
          <button class="ov-btn" id="cbSolve">Solve</button>
        </div>
        <div class="ov-section">2×2 System: aX+bY=e, cX+dY=f</div>
        <div class="ov-row">
          <input id="sA" placeholder="a" />
          <input id="sB" placeholder="b" />
          <input id="sE" placeholder="e" />
        </div>
        <div class="ov-row">
          <input id="sC" placeholder="c" />
          <input id="sD" placeholder="d" />
          <input id="sF" placeholder="f" />
          <button class="ov-btn" id="sysSolve">Solve</button>
        </div>
        <div class="ov-section">3×3 System: a₁X+b₁Y+c₁Z=d₁, ...</div>
        <div class="ov-row">
          <input id="tA1" placeholder="a1" /><input id="tB1" placeholder="b1" />
          <input id="tC1" placeholder="c1" /><input id="tD1" placeholder="d1" />
        </div>
        <div class="ov-row">
          <input id="tA2" placeholder="a2" /><input id="tB2" placeholder="b2" />
          <input id="tC2" placeholder="c2" /><input id="tD2" placeholder="d2" />
        </div>
        <div class="ov-row">
          <input id="tA3" placeholder="a3" /><input id="tB3" placeholder="b3" />
          <input id="tC3" placeholder="c3" /><input id="tD3" placeholder="d3" />
          <button class="ov-btn" id="tSolve">Solve</button>
        </div>
        <div class="ov-result" id="eqnResult">Solutions will appear here.</div>
      `);
      document.getElementById('linSolve').onclick = () => {
        const a = parseFloat(document.getElementById('linA').value);
        const b = parseFloat(document.getElementById('linB').value);
        const c = parseFloat(document.getElementById('linC').value);
        if (isNaN(a)||isNaN(b)||isNaN(c)){ document.getElementById('eqnResult').textContent='Enter valid numbers'; return; }
        if (a === 0){ document.getElementById('eqnResult').textContent = b===c ? 'Infinite solutions' : 'No solution'; return; }
        document.getElementById('eqnResult').textContent = `X = ${formatResult((c-b)/a)}`;
      };
      document.getElementById('qdSolve').onclick = () => {
        const a = parseFloat(document.getElementById('qdA').value);
        const b = parseFloat(document.getElementById('qdB').value);
        const c = parseFloat(document.getElementById('qdC').value);
        if (isNaN(a)||isNaN(b)||isNaN(c)){ document.getElementById('eqnResult').textContent='Enter valid numbers'; return; }
        if (a === 0){ document.getElementById('eqnResult').textContent = `Not quadratic. X = ${formatResult(-c/b)}`; return; }
        const d = b*b - 4*a*c;
        let out = `Discriminant = ${formatResult(d)}\n`;
        if (d > 0){
          out += `X₁ = ${formatResult((-b + Math.sqrt(d))/(2*a))}\nX₂ = ${formatResult((-b - Math.sqrt(d))/(2*a))}`;
        } else if (Math.abs(d) < 1e-12){
          out += `X = ${formatResult(-b/(2*a))} (double root)`;
        } else {
          const re = -b/(2*a), im = Math.sqrt(-d)/(2*a);
          out += `X = ${formatResult(re)} ± ${formatResult(im)}i (complex)`;
        }
        document.getElementById('eqnResult').textContent = out;
      };
      // Cubic solver using Cardano's formula
      document.getElementById('cbSolve').onclick = () => {
        const a = parseFloat(document.getElementById('cbA').value);
        const b = parseFloat(document.getElementById('cbB').value);
        const c = parseFloat(document.getElementById('cbC').value);
        const d = parseFloat(document.getElementById('cbD').value);
        if ([a,b,c,d].some(isNaN)){ document.getElementById('eqnResult').textContent='Enter valid numbers'; return; }
        if (a === 0){ document.getElementById('eqnResult').textContent = 'Not cubic. Use quadratic.'; return; }
        // Normalize: x³ + p x² + q x + r = 0
        const p = b/a, q = c/a, r = d/a;
        // Substitute x = t - p/3 → t³ + Pt + Q = 0
        const P = q - p*p/3;
        const Q = 2*p*p*p/27 - p*q/3 + r;
        const disc = Q*Q/4 + P*P*P/27;
        let out = '';
        const shift = -p/3;
        if (disc > 0){
          const u = Math.cbrt(-Q/2 + Math.sqrt(disc));
          const v = Math.cbrt(-Q/2 - Math.sqrt(disc));
          const t1 = u + v;
          const real2 = -(u+v)/2;
          const im2 = (u-v)*Math.sqrt(3)/2;
          out = `X₁ = ${formatResult(t1 + shift)}\nX₂ = ${formatResult(real2 + shift)} + ${formatResult(Math.abs(im2))}i\nX₃ = ${formatResult(real2 + shift)} − ${formatResult(Math.abs(im2))}i`;
        } else if (Math.abs(disc) < 1e-12){
          const u = Math.cbrt(-Q/2);
          out = `X₁ = ${formatResult(2*u + shift)}\nX₂ = X₃ = ${formatResult(-u + shift)}`;
        } else {
          const phi = Math.acos(-Q/2 / Math.sqrt(-P*P*P/27));
          const m = 2*Math.sqrt(-P/3);
          out = `X₁ = ${formatResult(m*Math.cos(phi/3) + shift)}\nX₂ = ${formatResult(m*Math.cos((phi+2*Math.PI)/3) + shift)}\nX₃ = ${formatResult(m*Math.cos((phi+4*Math.PI)/3) + shift)}`;
        }
        document.getElementById('eqnResult').textContent = out;
      };
      document.getElementById('sysSolve').onclick = () => {
        const a = parseFloat(document.getElementById('sA').value);
        const b = parseFloat(document.getElementById('sB').value);
        const e = parseFloat(document.getElementById('sE').value);
        const c = parseFloat(document.getElementById('sC').value);
        const d = parseFloat(document.getElementById('sD').value);
        const f = parseFloat(document.getElementById('sF').value);
        if ([a,b,c,d,e,f].some(isNaN)){ document.getElementById('eqnResult').textContent='Enter valid numbers'; return; }
        const det = a*d - b*c;
        if (det === 0){ document.getElementById('eqnResult').textContent = 'No unique solution'; return; }
        const x = (e*d - b*f)/det;
        const y = (a*f - e*c)/det;
        document.getElementById('eqnResult').textContent = `X = ${formatResult(x)}\nY = ${formatResult(y)}`;
      };
      // 3×3 system solver (Cramer's rule)
      document.getElementById('tSolve').onclick = () => {
        const vs = ['tA1','tB1','tC1','tD1','tA2','tB2','tC2','tD2','tA3','tB3','tC3','tD3'];
        const vals = vs.map(id => parseFloat(document.getElementById(id).value));
        if (vals.some(isNaN)){ document.getElementById('eqnResult').textContent='Enter all 12 coefficients'; return; }
        const [a1,b1,c1,d1, a2,b2,c2,d2, a3,b3,c3,d3] = vals;
        const det = a1*(b2*c3-b3*c2) - b1*(a2*c3-a3*c2) + c1*(a2*b3-a3*b2);
        if (Math.abs(det) < 1e-14){ document.getElementById('eqnResult').textContent='No unique solution (det=0)'; return; }
        const dx = d1*(b2*c3-b3*c2) - b1*(d2*c3-d3*c2) + c1*(d2*b3-d3*b2);
        const dy = a1*(d2*c3-d3*c2) - d1*(a2*c3-a3*c2) + c1*(a2*d3-a3*d2);
        const dz = a1*(b2*d3-b3*d2) - b1*(a2*d3-a3*d2) + d1*(a2*b3-a3*b2);
        document.getElementById('eqnResult').textContent = `X = ${formatResult(dx/det)}\nY = ${formatResult(dy/det)}\nZ = ${formatResult(dz/det)}`;
      };
    }

    /* ----- Constants overlay ----- */
    function openConstOverlay(){
      let list = CONSTANTS.map(c =>
        `<div class="mode-row" data-cid="${c.id}">
          <div class="m-icon" style="font-size:9px;">${c.id}</div>
          <div class="m-text">
            <div class="m-name">${c.name} <span style="color:var(--accent-2);font-size:11px;">(${c.sym})</span></div>
            <div class="m-desc">${c.val.toExponential(6)} ${c.unit}</div>
          </div>
        </div>`).join('');
      openOverlay('CONST — 40 Scientific Constants', `
        <p style="color:var(--text-dim);font-size:11px;margin-bottom:8px;">Tap a constant to insert its value:</p>
        <div>${list}</div>
      `);
      document.querySelectorAll('#overlayBox [data-cid]').forEach(el => {
        el.onclick = () => {
          const c = CONSTANTS.find(x => x.id == el.dataset.cid);
          if (c){
            closeOverlay();
            insert(formatResult(c.val));
            showToast(c.sym + ' = ' + c.val.toExponential(4));
          }
        };
      });
    }

    /* ----- Conversions overlay ----- */
    function openConvOverlay(){
      let list = CONVERSIONS.map(c =>
        `<div class="mode-row" data-cid="${c.id}">
          <div class="m-icon" style="font-size:9px;">${c.id}</div>
          <div class="m-text">
            <div class="m-name">${c.name}</div>
          </div>
        </div>`).join('');
      openOverlay('CONV — 40 Metric Conversions', `
        <p style="color:var(--text-dim);font-size:11px;margin-bottom:8px;">Tap a conversion, enter the value, and tap Convert:</p>
        <div>${list}</div>
        <div class="ov-section" style="margin-top:12px;">Convert value:</div>
        <div class="ov-row">
          <input id="convVal" placeholder="value" />
          <span id="convSelName" style="color:var(--accent);font-size:12px;padding:8px 4px;">(select above)</span>
        </div>
        <div class="ov-row">
          <button class="ov-btn" id="convGo">Convert</button>
        </div>
        <div class="ov-result" id="convResult">Result will appear here.</div>
      `);
      let selConv = null;
      document.querySelectorAll('#overlayBox [data-cid]').forEach(el => {
        el.onclick = () => {
          selConv = CONVERSIONS.find(x => x.id == el.dataset.cid);
          document.getElementById('convSelName').textContent = selConv.name;
        };
      });
      document.getElementById('convGo').onclick = () => {
        if (!selConv){ document.getElementById('convResult').textContent = 'Select a conversion first'; return; }
        const v = parseFloat(document.getElementById('convVal').value);
        if (isNaN(v)){ document.getElementById('convResult').textContent = 'Enter a valid number'; return; }
        const r = selConv.f(v);
        document.getElementById('convResult').textContent = `${v} ${selConv.name.split(' → ')[0]} = ${formatResult(r)} ${selConv.name.split(' → ')[1]}`;
        closeOverlay();
        insert(formatResult(r));
        showToast('Converted: ' + selConv.name);
      };
    }

    /* ----- CALC function (evaluate with variable) ----- */
    function openCalcOverlay(){
      openOverlay('CALC — Evaluate Expression with Variable', `
        <p style="color:var(--text-dim);font-size:11px;margin-bottom:8px;">Use X as the variable. Enter an expression like X²+2*X+1, then provide X value.</p>
        <input id="calcExpr" placeholder="e.g. X^2+2*X+1" style="width:100%;"/>
        <div class="ov-section">Variable value</div>
        <div class="ov-row">
          <input id="calcX" placeholder="X = 5" />
          <button class="ov-btn" id="calcGo">CALC</button>
        </div>
        <div class="ov-result" id="calcResult">Result will appear here.</div>
      `);
      document.getElementById('calcGo').onclick = () => {
        const expr = document.getElementById('calcExpr').value;
        const xVal = parseFloat(document.getElementById('calcX').value);
        if (!expr){ document.getElementById('calcResult').textContent = 'No expression'; return; }
        if (isNaN(xVal)){ document.getElementById('calcResult').textContent = 'Enter X value'; return; }
        const r = calcFunction(expr, 'X', xVal);
        if (!r.ok){ document.getElementById('calcResult').textContent = 'Error: ' + r.error; return; }
        document.getElementById('calcResult').textContent = `f(${xVal}) = ${formatResult(r.value)}`;
      };
    }

    /* ----- SOLVE function (root finder) ----- */
    function openSolveOverlay(){
      openOverlay('SOLVE — Find Root of f(X) = 0', `
        <p style="color:var(--text-dim);font-size:11px;margin-bottom:8px;">Use X as the variable. Enter f(X)=0 form (the left-hand side of equation). Newton's method will be applied.</p>
        <input id="solveExpr" placeholder="e.g. X^2-4" style="width:100%;"/>
        <div class="ov-section">Initial guess (optional)</div>
        <div class="ov-row">
          <input id="solveGuess" placeholder="guess = 1" />
          <button class="ov-btn" id="solveGo">SOLVE</button>
        </div>
        <div class="ov-result" id="solveResult">Solution will appear here.</div>
      `);
      document.getElementById('solveGo').onclick = () => {
        const expr = document.getElementById('solveExpr').value;
        let guess = parseFloat(document.getElementById('solveGuess').value);
        if (isNaN(guess)) guess = 1;
        if (!expr){ document.getElementById('solveResult').textContent = 'No expression'; return; }
        const r = solveFunction(expr, 'X', guess);
        if (!r.ok){ document.getElementById('solveResult').textContent = 'Error: ' + r.error; return; }
        document.getElementById('solveResult').textContent = `X = ${formatResult(r.value)}\n(iterations: ${r.iterations})`;
        closeOverlay();
        insert(formatResult(r.value));
        showToast('Solved: X = ' + formatResult(r.value));
      };
    }

    /* ----- Setup overlay ----- */
    function openSetupOverlay(){
      openOverlay('SETUP — Calculator Settings', `
        <div class="setting-group" style="margin:0;">
          <div class="setting-row">
            <span class="setting-label">Angle mode</span>
            <div class="seg-control">
              <button data-ang="DEG" class="${S.angleMode==='DEG'?'active':''}">DEG</button>
              <button data-ang="RAD" class="${S.angleMode==='RAD'?'active':''}">RAD</button>
              <button data-ang="GRA" class="${S.angleMode==='GRA'?'active':''}">GRA</button>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">Display format</span>
            <div class="seg-control">
              <button data-d="NORM" class="${S.displayMode==='NORM'?'active':''}">NORM</button>
              <button data-d="FIX" class="${S.displayMode==='FIX'?'active':''}">FIX</button>
              <button data-d="SCI" class="${S.displayMode==='SCI'?'active':''}">SCI</button>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">Decimal digits</span>
            <div class="seg-control">
              ${[2,4,6,8].map(n => `<button data-fix="${n}" class="${S.fixDigits===n?'active':''}">${n}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="ov-section">Memory & Variables</div>
        <div class="setting-group" style="margin:0;">
          <div class="setting-row"><span class="setting-label">M (memory)</span><span class="setting-value">${formatResult(S.memory)}</span></div>
          <div class="setting-row"><span class="setting-label">Ans (last)</span><span class="setting-value">${formatResult(S.lastAnswer)}</span></div>
          ${Object.entries(S.variables).filter(([k])=>k!=='M').map(([k,v])=>
            `<div class="setting-row"><span class="setting-label">${k}</span><span class="setting-value">${formatResult(v)}</span></div>`
          ).join('')}
        </div>
        <div class="ov-row"><button class="ov-btn ghost" id="clrMemBtn2" style="width:100%;">Clear Memory & Variables</button></div>
      `);
      document.querySelectorAll('#overlayBox [data-ang]').forEach(el => {
        el.onclick = () => { S.angleMode = el.dataset.ang; openSetupOverlay(); render(); livePreview(); };
      });
      document.querySelectorAll('#overlayBox [data-d]').forEach(el => {
        el.onclick = () => { S.displayMode = el.dataset.d; openSetupOverlay(); render(); livePreview(); };
      });
      document.querySelectorAll('#overlayBox [data-fix]').forEach(el => {
        el.onclick = () => { S.fixDigits = parseInt(el.dataset.fix,10); openSetupOverlay(); render(); livePreview(); };
      });
      document.getElementById('clrMemBtn2').onclick = () => {
        S.memory = 0; S.lastAnswer = 0;
        Object.keys(S.variables).forEach(k => S.variables[k] = 0);
        showToast('All memory cleared');
        openSetupOverlay();
        render();
      };
    }

    /* ----- Scientific function library ----- */
    function openFunctionOverlay(){
      const groups = [
        { title:'Reciprocal trigonometry', items:['sec(','csc(','cot(','asec(','acsc(','acot('] },
        { title:'Additional hyperbolic functions', items:['sech(','csch(','coth(','asech(','acsch(','acoth('] },
        { title:'Logs, powers and roots', items:['log2(','exp10(','logb(','root(','pow('] },
        { title:'Rounding and numeric helpers', items:['floor(','ceil(','round(','sign(','min(','max(','hypot('] },
      ];
      const html = groups.map(g => `
        <div class="ov-section">${g.title}</div>
        <div class="ov-row" style="flex-wrap:wrap;">
          ${g.items.map(fn => `<button class="ov-btn ghost" data-fninsert="${fn}">${fn}</button>`).join('')}
        </div>`).join('');
      openOverlay('Scientific Math Function Library', html +
        '<p style="color:var(--text-dim);font-size:11px;margin-top:10px;">Tap a function to insert it into the expression. Complete the arguments and press =.</p>');
      document.querySelectorAll('#overlayBox [data-fninsert]').forEach(btn => {
        btn.onclick = () => {
          const fn = btn.dataset.fninsert;
          closeOverlay();
          insert(fn);
        };
      });
    }

    /* ----- Options overlay ----- */
    function openOptnOverlay(){
      openOverlay('OPTN — Advanced Options', `
        <p style="color:var(--text-dim);font-size:11px;margin-bottom:8px;">Choose a category:</p>
        <div class="mode-list">
          <div class="mode-row" data-opt="functions"><div class="m-icon">ƒx</div><div class="m-text"><div class="m-name">Math Function Library</div><div class="m-desc">Insert additional scientific functions</div></div></div>
          <div class="mode-row" data-opt="const"><div class="m-icon">C</div><div class="m-text"><div class="m-name">Scientific Constants</div><div class="m-desc">40 built-in constants</div></div></div>
          <div class="mode-row" data-opt="conv"><div class="m-icon">↔</div><div class="m-text"><div class="m-name">Metric Conversions</div><div class="m-desc">40 unit conversions</div></div></div>
          <div class="mode-row" data-opt="calc"><div class="m-icon">ƒ</div><div class="m-text"><div class="m-name">CALC Function</div><div class="m-desc">Evaluate expression with X</div></div></div>
          <div class="mode-row" data-opt="solve"><div class="m-icon">∃</div><div class="m-text"><div class="m-name">SOLVE Function</div><div class="m-desc">Find root of f(X)=0</div></div></div>
          <div class="mode-row" data-opt="matrix"><div class="m-icon">[A]</div><div class="m-text"><div class="m-name">Matrix</div><div class="m-desc">Mat A/B/C and operations</div></div></div>
          <div class="mode-row" data-opt="vector"><div class="m-icon">→</div><div class="m-text"><div class="m-name">Vector</div><div class="m-desc">Vct A/B/C and operations</div></div></div>
          <div class="mode-row" data-opt="setup"><div class="m-icon">⚙</div><div class="m-text"><div class="m-name">Setup</div><div class="m-desc">Configure calculator</div></div></div>
        </div>
      `);
      document.querySelectorAll('#overlayBox [data-opt]').forEach(el => {
        el.onclick = () => {
          const opt = el.dataset.opt;
          if (opt === 'functions') openFunctionOverlay();
          else if (opt === 'const') openConstOverlay();
          else if (opt === 'conv') openConvOverlay();
          else if (opt === 'calc') openCalcOverlay();
          else if (opt === 'solve') openSolveOverlay();
          else if (opt === 'matrix') openMatrixOverlay();
          else if (opt === 'vector') openVectorOverlay();
          else if (opt === 'setup') openSetupOverlay();
        };
      });
    }

    /* ----- Matrix overlay ----- */
    function openMatrixOverlay(){
      const matRow = (name) => {
        const m = S.matrices[name];
        const info = m ? `${m.rows}×${m.cols}` : 'not set';
        return `<div class="mode-row" data-mat="${name}">
          <div class="m-icon">[${name}]</div>
          <div class="m-text">
            <div class="m-name">Matrix ${name}</div>
            <div class="m-desc">${info}</div>
          </div>
        </div>`;
      };
      openOverlay('MAT — Matrix Calculator', `
        <div class="ov-section">Edit Matrices</div>
        <div class="mode-list">
          ${matRow('A')}
          ${matRow('B')}
          ${matRow('C')}
        </div>
        <div class="ov-section">Matrix Operations</div>
        <div class="ov-row" style="flex-wrap:wrap;">
          <button class="ov-btn" data-mop="A+B">A+B</button>
          <button class="ov-btn" data-mop="A-B">A−B</button>
          <button class="ov-btn" data-mop="A*B">A×B</button>
          <button class="ov-btn" data-mop="A^2">A²</button>
          <button class="ov-btn" data-mop="A^-1">A⁻¹</button>
          <button class="ov-btn" data-mop="detA">Det(A)</button>
          <button class="ov-btn" data-mop="trnA">Trn(A)</button>
          <button class="ov-btn" data-mop="absA">|A|</button>
        </div>
        <div class="ov-result" id="matResult">Result will appear here.</div>
      `);
      document.querySelectorAll('#overlayBox [data-mat]').forEach(el => {
        el.onclick = () => { openMatrixEditor(el.dataset.mat); };
      });
      document.querySelectorAll('#overlayBox [data-mop]').forEach(el => {
        el.onclick = () => {
          const op = el.dataset.mop;
          const A = S.matrices.A, B = S.matrices.B;
          try {
            let res;
            if (op === 'A+B') { if(!A||!B) throw new Error('Set A and B first'); res = matAdd(A,B); }
            else if (op === 'A-B') { if(!A||!B) throw new Error('Set A and B first'); res = matSub(A,B); }
            else if (op === 'A*B') { if(!A||!B) throw new Error('Set A and B first'); res = matMul(A,B); }
            else if (op === 'A^2') { if(!A) throw new Error('Set A first'); res = matMul(A,A); }
            else if (op === 'A^-1') { if(!A) throw new Error('Set A first'); res = matInverse(A); }
            else if (op === 'detA') { if(!A) throw new Error('Set A first'); document.getElementById('matResult').textContent = 'Det(A) = ' + formatResult(matDet(A)); return; }
            else if (op === 'trnA') { if(!A) throw new Error('Set A first'); res = matTranspose(A); }
            else if (op === 'absA') { if(!A) throw new Error('Set A first'); document.getElementById('matResult').textContent = '|A| (sum of abs) = ' + formatResult(A.data.reduce((s,v)=>s+Math.abs(v),0)); return; }
            S.matrices.Ans = res;
            document.getElementById('matResult').textContent = `Result (${res.rows}×${res.cols}):\n` + matFormat(res);
          } catch(e){ document.getElementById('matResult').textContent = 'Error: ' + e.message; }
        };
      });
    }

    function openMatrixEditor(name){
      let m = S.matrices[name] || matCreate(2,2);
      openOverlay(`Edit Matrix ${name}`, `
        <div class="ov-row">
          <label style="color:var(--text-dim);font-size:11px;">Rows:</label>
          <input id="matRows" type="number" min="1" max="3" value="${m.rows}" style="max-width:60px;" />
          <label style="color:var(--text-dim);font-size:11px;">Cols:</label>
          <input id="matCols" type="number" min="1" max="3" value="${m.cols}" style="max-width:60px;" />
          <button class="ov-btn ghost" id="matResize">Resize</button>
        </div>
        <div id="matGrid"></div>
        <div class="ov-row" style="margin-top:8px;">
          <button class="ov-btn" id="matSave">Save Matrix ${name}</button>
        </div>
      `);
      const renderGrid = () => {
        const rows = parseInt(document.getElementById('matRows').value,10) || 2;
        const cols = parseInt(document.getElementById('matCols').value,10) || 2;
        let html = '<div style="display:grid;gap:4px;margin-top:8px;" id="matGridInner">';
        for (let i = 0; i < rows; i++){
          html += '<div style="display:grid;grid-template-columns:repeat('+cols+',1fr);gap:4px;">';
          for (let j = 0; j < cols; j++){
            const val = (S.matrices[name] && S.matrices[name].rows === rows && S.matrices[name].cols === cols) ? S.matrices[name].data[i*cols+j] : 0;
            html += `<input class="mat-cell" data-r="${i}" data-c="${j}" value="${val}" style="text-align:center;padding:8px 4px;" />`;
          }
          html += '</div>';
        }
        html += '</div>';
        document.getElementById('matGrid').innerHTML = html;
      };
      renderGrid();
      document.getElementById('matResize').onclick = () => {
        const rows = parseInt(document.getElementById('matRows').value,10);
        const cols = parseInt(document.getElementById('matCols').value,10);
        S.matrices[name] = matCreate(rows, cols);
        renderGrid();
      };
      document.getElementById('matSave').onclick = () => {
        const rows = parseInt(document.getElementById('matRows').value,10);
        const cols = parseInt(document.getElementById('matCols').value,10);
        const cells = document.querySelectorAll('#overlayBox .mat-cell');
        const data = new Array(rows*cols).fill(0);
        cells.forEach(c => {
          const r = parseInt(c.dataset.r,10);
          const cc = parseInt(c.dataset.c,10);
          data[r*cols+cc] = parseFloat(c.value) || 0;
        });
        S.matrices[name] = matCreate(rows, cols, data);
        showToast(`Matrix ${name} saved (${rows}×${cols})`);
        openMatrixOverlay();
      };
    }

    /* ----- Vector overlay ----- */
    function openVectorOverlay(){
      const vctRow = (name) => {
        const v = S.vectors[name];
        const info = v ? `${v.dim}D` : 'not set';
        return `<div class="mode-row" data-vct="${name}">
          <div class="m-icon">[${name}]</div>
          <div class="m-text">
            <div class="m-name">Vector ${name}</div>
            <div class="m-desc">${info}</div>
          </div>
        </div>`;
      };
      openOverlay('VCT — Vector Calculator', `
        <div class="ov-section">Edit Vectors</div>
        <div class="mode-list">
          ${vctRow('A')}
          ${vctRow('B')}
          ${vctRow('C')}
        </div>
        <div class="ov-section">Vector Operations</div>
        <div class="ov-row" style="flex-wrap:wrap;">
          <button class="ov-btn" data-vop="A+B">A+B</button>
          <button class="ov-btn" data-vop="A-B">A−B</button>
          <button class="ov-btn" data-vop="A·B">A·B</button>
          <button class="ov-btn" data-vop="A×B">A×B</button>
          <button class="ov-btn" data-vop="|A|">|A|</button>
          <button class="ov-btn" data-vop="angle">∠(A,B)</button>
        </div>
        <div class="ov-result" id="vctResult">Result will appear here.</div>
      `);
      document.querySelectorAll('#overlayBox [data-vct]').forEach(el => {
        el.onclick = () => { openVectorEditor(el.dataset.vct); };
      });
      document.querySelectorAll('#overlayBox [data-vop]').forEach(el => {
        el.onclick = () => {
          const op = el.dataset.vop;
          const A = S.vectors.A, B = S.vectors.B;
          try {
            let res;
            if (op === 'A+B') { if(!A||!B) throw new Error('Set A and B first'); res = vctAdd(A,B); document.getElementById('vctResult').textContent = 'A+B = ' + vctFormat(res); }
            else if (op === 'A-B') { if(!A||!B) throw new Error('Set A and B first'); res = vctSub(A,B); document.getElementById('vctResult').textContent = 'A−B = ' + vctFormat(res); }
            else if (op === 'A·B') { if(!A||!B) throw new Error('Set A and B first'); document.getElementById('vctResult').textContent = 'A·B = ' + formatResult(vctDot(A,B)); }
            else if (op === 'A×B') { if(!A||!B) throw new Error('Set A and B first'); res = vctCross(A,B); document.getElementById('vctResult').textContent = 'A×B = ' + vctFormat(res); }
            else if (op === '|A|') { if(!A) throw new Error('Set A first'); document.getElementById('vctResult').textContent = '|A| = ' + formatResult(vctAbs(A)); }
            else if (op === 'angle') { if(!A||!B) throw new Error('Set A and B first'); document.getElementById('vctResult').textContent = '∠(A,B) = ' + formatResult(vctAngle(A,B)) + '°'; }
            if (res) S.vectors.Ans = res;
          } catch(e){ document.getElementById('vctResult').textContent = 'Error: ' + e.message; }
        };
      });
    }

    function openVectorEditor(name){
      let v = S.vectors[name] || vctCreate(3);
      openOverlay(`Edit Vector ${name}`, `
        <div class="ov-row">
          <label style="color:var(--text-dim);font-size:11px;">Dimension:</label>
          <select id="vctDim" style="max-width:80px;">
            <option value="2" ${v.dim===2?'selected':''}>2D</option>
            <option value="3" ${v.dim===3?'selected':''}>3D</option>
          </select>
        </div>
        <div id="vctGrid"></div>
        <div class="ov-row" style="margin-top:8px;">
          <button class="ov-btn" id="vctSave">Save Vector ${name}</button>
        </div>
      `);
      const renderGrid = () => {
        const dim = parseInt(document.getElementById('vctDim').value,10);
        let html = '<div style="display:grid;gap:4px;margin-top:8px;" id="vctGridInner">';
        for (let i = 0; i < dim; i++){
          const val = (S.vectors[name] && S.vectors[name].dim === dim) ? S.vectors[name].data[i] : 0;
          html += `<input class="vct-cell" data-i="${i}" value="${val}" style="text-align:center;padding:8px 4px;" placeholder="v[${i+1}]" />`;
        }
        html += '</div>';
        document.getElementById('vctGrid').innerHTML = html;
      };
      renderGrid();
      document.getElementById('vctDim').onchange = renderGrid;
      document.getElementById('vctSave').onclick = () => {
        const dim = parseInt(document.getElementById('vctDim').value,10);
        const cells = document.querySelectorAll('#overlayBox .vct-cell');
        const data = new Array(dim).fill(0);
        cells.forEach((c,i) => { data[i] = parseFloat(c.value) || 0; });
        S.vectors[name] = vctCreate(dim, data);
        showToast(`Vector ${name} saved (${dim}D)`);
        openVectorOverlay();
      };
    }

    /* ----- Expanded Complex overlay with Re, Im, Conjg, arg ----- */
    function openComplexOverlayExpanded(){
      openOverlay('COMPLEX — Complex Number Operations', `
        <div class="ov-section">Complex Numbers (a+bi form, or r∠θ for polar)</div>
        <div class="ov-row">
          <input id="cxA" placeholder="3+4i or 5∠53.13" />
          <input id="cxB" placeholder="1-2i" />
        </div>
        <div class="ov-row">
          <button class="ov-btn" data-op="add">a + b</button>
          <button class="ov-btn" data-op="sub">a − b</button>
          <button class="ov-btn" data-op="mul">a × b</button>
          <button class="ov-btn" data-op="div">a ÷ b</button>
        </div>
        <div class="ov-section">Single-operand functions (on A)</div>
        <div class="ov-row" style="flex-wrap:wrap;">
          <button class="ov-btn ghost" data-op="abs">|a|</button>
          <button class="ov-btn ghost" data-op="conj">Conjg(a)</button>
          <button class="ov-btn ghost" data-op="arg">arg(a)</button>
          <button class="ov-btn ghost" data-op="Re">Re(a)</button>
          <button class="ov-btn ghost" data-op="Im">Im(a)</button>
          <button class="ov-btn ghost" data-op="polar">a→r∠θ</button>
        </div>
        <div class="ov-result" id="cxResult">Results will appear here.</div>
      `);
      document.querySelectorAll('#overlayBox [data-op]').forEach(b => {
        b.onclick = () => {
          const a = parseCx(document.getElementById('cxA').value);
          const bV = parseCx(document.getElementById('cxB').value);
          if (!a){ document.getElementById('cxResult').textContent = 'Invalid first number'; return; }
          const op = b.dataset.op;
          let res;
          if (op === 'add'){ if(!bV)return; res = cxAdd(a,bV); document.getElementById('cxResult').textContent = '= ' + fmtCx(res); }
          else if (op === 'sub'){ if(!bV)return; res = cxSub(a,bV); document.getElementById('cxResult').textContent = '= ' + fmtCx(res); }
          else if (op === 'mul'){ if(!bV)return; res = cxMul(a,bV); document.getElementById('cxResult').textContent = '= ' + fmtCx(res); }
          else if (op === 'div'){ if(!bV)return; res = cxDiv(a,bV); document.getElementById('cxResult').textContent = '= ' + fmtCx(res); }
          else if (op === 'abs'){ document.getElementById('cxResult').textContent = '|a| = ' + formatResult(cxAbs(a)); }
          else if (op === 'conj'){ res = cxConj(a); document.getElementById('cxResult').textContent = 'Conjg(a) = ' + fmtCx(res); }
          else if (op === 'arg'){ document.getElementById('cxResult').textContent = 'arg(a) = ' + formatResult(cxArg(a)) + '°'; }
          else if (op === 'Re'){ document.getElementById('cxResult').textContent = 'Re(a) = ' + formatResult(cxRe(a)); }
          else if (op === 'Im'){ document.getElementById('cxResult').textContent = 'Im(a) = ' + formatResult(cxIm(a)); }
          else if (op === 'polar'){ document.getElementById('cxResult').textContent = `a = ${formatResult(cxAbs(a))}∠${formatResult(cxArg(a))}°`; }
        };
      });
    }

    /* =====================================================================
       TOAST
       ===================================================================== */
    let toastTimer = null;
    function showToast(msg){
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove('show'), 1400);
    }

    /* =====================================================================
       KEYBOARD (desktop testing / physical keyboards)
       ===================================================================== */
    document.addEventListener('keydown', (e) => {
      if (document.activeElement && ['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
      const k = e.key;
      if (k >= '0' && k <= '9'){ insert(k); e.preventDefault(); }
      else if (k === '.'){ insert('.'); e.preventDefault(); }
      else if (k === '+'){ insert('+'); e.preventDefault(); }
      else if (k === '-'){ insert('−'); e.preventDefault(); }
      else if (k === '*'){ insert('×'); e.preventDefault(); }
      else if (k === '/'){ insert('÷'); e.preventDefault(); }
      else if (k === '^'){ insert('^'); e.preventDefault(); }
      else if (k === '('){ insert('('); e.preventDefault(); }
      else if (k === ')'){ insert(')'); e.preventDefault(); }
      else if (k === '%'){ insert('/100*'); e.preventDefault(); }
      else if (k === '!'){ insert('!'); e.preventDefault(); }
      else if (k === 'Enter' || k === '='){ evaluateNow(); e.preventDefault(); }
      else if (k === 'Backspace'){ delChar(); e.preventDefault(); }
      else if (k === 'Escape'){ clearAll(); e.preventDefault(); }
      else if (k === 'ArrowLeft'){ moveCursor(-1); e.preventDefault(); }
      else if (k === 'ArrowRight'){ moveCursor(1); e.preventDefault(); }
      else if (k === 'p' || k === 'P'){ insert('π'); e.preventDefault(); }
      else if (k === 'e' || k === 'E'){ insert('e'); e.preventDefault(); }
      else if (k === 's' || k === 'S'){ insert('sin('); e.preventDefault(); }
      else if (k === 'c' || k === 'C'){ insert('cos('); e.preventDefault(); }
      else if (k === 't' || k === 'T'){ insert('tan('); e.preventDefault(); }
      else if (k === 'l' || k === 'L'){ insert('log('); e.preventDefault(); }
      else if (k === 'n' || k === 'N'){ insert('ln('); e.preventDefault(); }
      else if (k === 'q' || k === 'Q'){ insert('√('); e.preventDefault(); }
      else if (k === 'r' || k === 'R'){ insert('^2'); e.preventDefault(); }
    });

    /* Prevent zoom on double-tap (iOS) */
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300){ e.preventDefault(); }
      lastTouchEnd = now;
    }, { passive: false });

    /* Prevent pinch zoom */
    document.addEventListener('gesturestart', (e) => e.preventDefault());

    /* =====================================================================
       INIT
       ===================================================================== */
    buildKeypad();
    render();

    // Hide splash
    setTimeout(() => {
      document.getElementById('splash').classList.add('hide');
      setTimeout(() => document.getElementById('splash').style.display = 'none', 400);
    }, 600);

    // Welcome toast (short)
    setTimeout(() => showToast('Tap MODE for advanced features'), 800);

  }

  /* ---------- Boot ---------- */
  function init() {
    injectMeta();
    injectStyles();
    buildDOM();
    startApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
