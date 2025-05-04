document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.querySelector('.time-display');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const modeButtons = document.querySelectorAll('.mode');

    let timeLeft = 25 * 60; // 25 minutes in seconds
    let timerId = null;
    let isRunning = false;
    let isPaused = false;

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeDisplay.textContent = timeString;
        
        // Update browser tab title
        const activeMode = document.querySelector('.mode.active');
        const modeText = activeMode.textContent;
        document.title = `${timeString} - ${modeText} Timer`;
    }

    function startTimer() {
        if (!isRunning) {
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
                    document.title = 'Pomodoro Timer'; // Reset title when timer ends
                    alert('Time is up!');
                }
            }, 1000);
        }
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
        updateDisplay();
        startButton.disabled = false;
        startButton.textContent = 'Start';
        isPaused = false;
    }

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