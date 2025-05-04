document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.querySelector('.time-display');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const modeButtons = document.querySelectorAll('.mode');
    const focusModal = document.getElementById('focusModal');
    const focusInput = document.getElementById('focusInput');
    const confirmFocusButton = document.getElementById('confirmFocus');
    const skipFocusButton = document.getElementById('skipFocus');
    const focusText = document.querySelector('.focus-text');

    let timeLeft = 25 * 60; // 25 minutes in seconds
    let timerId = null;
    let isRunning = false;
    let isPaused = false;
    let currentFocus = '';

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeDisplay.textContent = timeString;
        
        // Update browser tab title
        const activeMode = document.querySelector('.mode.active');
        if (currentFocus && activeMode.textContent === 'Pomodoro') {
            document.title = `${timeString} | ${currentFocus}`;
        } else {
            document.title = `${timeString} | ${activeMode.textContent} Timer`;
        }
    }

    function showFocusModal() {
        focusModal.style.display = 'flex';
        focusInput.focus();
    }

    function hideFocusModal() {
        focusModal.style.display = 'none';
        focusInput.value = ''; // Clear input field
    }

    function handleFocusInput(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            confirmFocusButton.click();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            skipFocusButton.click();
        }
    }

    function startTimer() {
        if (!isRunning) {
            const activeMode = document.querySelector('.mode.active');
            if (activeMode.textContent === 'Pomodoro' && !isPaused && !currentFocus) {
                showFocusModal();
            } else {
                actuallyStartTimer();
            }
        }
    }

    function actuallyStartTimer() {
        isRunning = true;
        isPaused = false;
        startButton.disabled = true;
        startButton.textContent = 'Zeit läuft';
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerId);
                isRunning = false;
                startButton.disabled = false;
                startButton.textContent = 'Start';
                document.title = 'Pomodoro Timer';
                alert('Time is up!');
            }
        }, 1000);
    }

    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerId);
            isRunning = false;
            isPaused = true;
            startButton.disabled = false;
            startButton.textContent = 'Fortsetzen';
        }
    }

    function resetTimer() {
        pauseTimer();
        const activeMode = document.querySelector('.mode.active');
        timeLeft = parseInt(activeMode.dataset.time) * 60;
        focusText.textContent = '';
        currentFocus = '';
        updateDisplay(); // Update display after resetting focus
        startButton.disabled = false;
        startButton.textContent = 'Start';
        isPaused = false;
    }

    confirmFocusButton.addEventListener('click', () => {
        const focus = focusInput.value.trim();
        if (focus) {
            focusText.textContent = `Fokus: ${focus}`;
            currentFocus = focus;
        } else {
            focusText.textContent = '';
            currentFocus = '';
        }
        hideFocusModal();
        actuallyStartTimer();
    });

    skipFocusButton.addEventListener('click', () => {
        focusText.textContent = '';
        currentFocus = '';
        hideFocusModal();
        actuallyStartTimer();
    });

    focusInput.addEventListener('keydown', handleFocusInput);

    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            resetTimer();
        });
    });

    // Initialize the display
    updateDisplay();
}); 