document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modeBtns = document.querySelectorAll('.mode-btn');
    const controlsMode1 = document.getElementById('controlsMode1');
    const controlsModeTube = document.getElementById('controlsModeTube');
    const tubeContainer = document.getElementById('tubeContainer');
    const btnD20 = document.getElementById('btnD20');
    const btnHold = document.getElementById('btnHold');
    const diceValueEl = document.getElementById('diceValue');
    const diceLabelEl = document.getElementById('diceLabel');
    const diceContainer = document.getElementById('diceContainer');
    const tubeFill = document.getElementById('tubeFill');
    const root = document.documentElement;

    // State
    let currentMode = 1; // 1: Standard, 2: Biased D20, 3: Critical D8
    let isHolding = false;
    let tubeAnimFrame = null;
    let tubeStartTime = 0;
    let currentTubeValue = 0; // 0 to 1
    let isRolling = false;

    // Mode Switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isRolling || isHolding) return; // Prevent switching while active

            // Update active state
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentMode = parseInt(btn.dataset.mode);

            // Toggle UI elements
            if (currentMode === 1) {
                controlsMode1.classList.remove('hidden');
                controlsModeTube.classList.add('hidden');
                tubeContainer.classList.add('hidden');
                diceLabelEl.textContent = "Ready to roll (Standard)";
            } else if (currentMode === 2) {
                controlsMode1.classList.add('hidden');
                controlsModeTube.classList.remove('hidden');
                tubeContainer.classList.remove('hidden');
                diceLabelEl.textContent = "Ready to roll (Positional D6)";
                resetTube();
            } else if (currentMode === 3) {
                controlsMode1.classList.add('hidden');
                controlsModeTube.classList.remove('hidden');
                tubeContainer.classList.remove('hidden');
                diceLabelEl.textContent = "Ready to roll (Critical D8)";
                resetTube();
            }

            diceValueEl.textContent = "?";
        });
    });

    // Helper: Simulate Roll Animation
    const animateRoll = (finalValue, sides, callback, accelerate = false) => {
        isRolling = true;
        diceContainer.classList.add('rolling');
        diceValueEl.classList.remove('pop');

        let rolls = 0;
        const maxRolls = 12;
        let currentDelay = accelerate ? 250 : 50; // Start slow only if accelerate is true

        const doRoll = () => {
            diceValueEl.textContent = Math.floor(Math.random() * sides) + 1;
            rolls++;

            if (rolls >= maxRolls) {
                diceContainer.classList.remove('rolling');
                diceValueEl.textContent = finalValue;
                diceValueEl.classList.add('pop');
                isRolling = false;
                if (callback) callback();
            } else {
                if (accelerate) {
                    // Decrease delay to speed up towards the end
                    currentDelay = Math.max(30, currentDelay * 0.75);
                }
                setTimeout(doRoll, currentDelay);
            }
        };

        setTimeout(doRoll, currentDelay);
    };

    // Mode 1: Standard Rolls
    btnD20.addEventListener('click', () => {
        if (isRolling) return;
        const result = Math.floor(Math.random() * 20) + 1;
        diceLabelEl.textContent = "Rolling D20...";
        animateRoll(result, 20, () => {
            diceLabelEl.textContent = `D20 Rolled: ${result}`;
        });
    });

    // Mode 2 & 3: Tube Logic
    const resetTube = () => {
        currentTubeValue = 0;
        updateTubeUI(currentTubeValue);
    };

    const updateTubeUI = (val) => {
        // val is 0.0 to 1.0
        tubeFill.style.width = `${val * 100}%`;

        // Color is handled by CSS in modern theme
        // root.style.setProperty('--tube-color', '#0f172a');
    };

    const animateTube = (timestamp) => {
        if (!tubeStartTime) tubeStartTime = timestamp;
        const elapsed = timestamp - tubeStartTime;

        if (currentMode === 3) {
            // Mode 3 (D8): slow at the beginning, fast at the end
            const speed = 0.003;
            let cycle = (elapsed * speed) % 2;
            let linearVal = cycle <= 1 ? cycle : 2 - cycle;
            // Power curve: makes it slow near 0 and fast near 1
            currentTubeValue = Math.pow(linearVal, 3);
        } else {
            // Mode 2 (D6): constant speed
            const speed = 0.005;
            let cycle = (elapsed * speed) % 2;
            currentTubeValue = cycle <= 1 ? cycle : 2 - cycle;
        }

        updateTubeUI(currentTubeValue);

        if (isHolding) {
            tubeAnimFrame = requestAnimationFrame(animateTube);
        }
    };

    const startHolding = (e) => {
        if (e.cancelable) e.preventDefault(); // prevent touch/mouse double fire
        if (isRolling || isHolding) return;

        isHolding = true;
        btnHold.textContent = "Charging...";
        diceLabelEl.textContent = "Charging...";
        tubeStartTime = 0;
        tubeAnimFrame = requestAnimationFrame(animateTube);
    };

    const stopHolding = (e) => {
        if (e.cancelable) e.preventDefault();
        if (!isHolding || isRolling) return;

        isHolding = false;
        btnHold.textContent = "Hold to Charge";
        cancelAnimationFrame(tubeAnimFrame);

        processChargedRoll();
    };

    // Event listeners for hold button (support touch and mouse)
    btnHold.addEventListener('mousedown', startHolding);
    btnHold.addEventListener('touchstart', startHolding, { passive: false });

    // Listen on window to catch release outside the button
    window.addEventListener('mouseup', stopHolding);
    window.addEventListener('touchend', stopHolding);

    const processChargedRoll = () => {
        if (currentMode === 2) {
            // Positional D6
            const v = currentTubeValue;

            // Map 0-1 directly to 1-6
            const result = Math.min(6, Math.floor(v * 6) + 1);

            diceLabelEl.textContent = `Rolling Positional D6`;
            animateRoll(result, 6, () => {
                diceLabelEl.textContent = `Positional D6: ${result}`;
            });

        } else if (currentMode === 3) {
            // Critical D8
            const v = currentTubeValue;

            // Exponential mapping: 
            // v^1.3 ensures 1, 2, 3 are distributed before 50%, 
            // 6 and 7 are easy after 75%, and 8 requires >91% charge.
            const result = Math.min(8, Math.floor(Math.pow(v, 1.3) * 8) + 1);

            diceLabelEl.textContent = `Rolling Crit D8 (Charge: ${currentTubeValue.toFixed(2)})`;
            animateRoll(result, 8, () => {
                if (result === 8) {
                    diceLabelEl.textContent = `CRITICAL HIT! (D8)`;
                    diceLabelEl.style.color = "var(--highlight)";
                    diceLabelEl.style.fontWeight = "900";
                    setTimeout(() => {
                        diceLabelEl.style.color = "";
                        diceLabelEl.style.fontWeight = "";
                    }, 2000);
                } else {
                    diceLabelEl.textContent = `Crit D8: ${result}`;
                }
            }, true);
        }
    };
});
