/**
 * timer.js
 * Handles timer functionality for the Lyubishev Time Tracker
 */

class Timer {
    constructor() {
        this.startTime = null;
        this.pausedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.isPaused = false;
        this.currentActivity = {
            name: '',
            category: '',
            notes: '',
            startTime: null,
            endTime: null,
            duration: 0
        };
        
        // Pomodoro timer properties
        this.pomodoroMode = false;
        this.pomodoroInterval = null;
        this.pomodoroTime = 25 * 60; // 25 minutes in seconds
        this.shortBreakTime = 5 * 60; // 5 minutes in seconds
        this.longBreakTime = 15 * 60; // 15 minutes in seconds
        this.pomodoroCount = 0;
        this.pomodoroState = 'work'; // 'work', 'shortBreak', 'longBreak'
        this.pomodoroTimeRemaining = this.pomodoroTime;
        this.pomodoroCallback = null;
    }

    // Start the timer
    start(activityName, category, notes) {
        if (this.isRunning) {
            console.warn('Timer is already running');
            return false;
        }

        this.startTime = new Date();
        this.pausedTime = 0;
        this.isRunning = true;
        this.isPaused = false;

        // Set current activity details
        this.currentActivity = {
            name: activityName || 'Unnamed Activity',
            category: category || '',
            notes: notes || '',
            startTime: this.startTime,
            endTime: null,
            duration: 0
        };

        // Start the timer interval
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);

        return true;
    }

    // Pause the timer
    pause() {
        if (!this.isRunning || this.isPaused) {
            return false;
        }

        clearInterval(this.timerInterval);
        this.pausedTime += (new Date() - this.startTime);
        this.isPaused = true;
        this.isRunning = false;

        return true;
    }

    // Resume the timer
    resume() {
        if (this.isRunning || !this.isPaused) {
            return false;
        }

        this.startTime = new Date();
        this.isRunning = true;
        this.isPaused = false;

        // Restart the timer interval
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);

        return true;
    }

    // Stop the timer and return the completed activity
    stop() {
        if (!this.isRunning && !this.isPaused) {
            return null;
        }

        clearInterval(this.timerInterval);
        
        const endTime = new Date();
        let duration = 0;

        if (this.isPaused) {
            duration = this.pausedTime;
        } else {
            duration = this.pausedTime + (endTime - this.startTime);
        }

        // Update the current activity with end time and duration
        this.currentActivity.endTime = endTime;
        this.currentActivity.duration = duration;

        // Reset timer state
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;

        // Return a copy of the completed activity
        return { ...this.currentActivity };
    }

    // Calculate and return the current elapsed time
    getElapsedTime() {
        if (!this.startTime) {
            return 0;
        }

        let elapsed = this.pausedTime;
        if (this.isRunning) {
            elapsed += (new Date() - this.startTime);
        }

        return elapsed;
    }

    // Format milliseconds to HH:MM:SS
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    // Update the timer display element
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const elapsed = this.getElapsedTime();
            timerElement.textContent = this.formatTime(elapsed);
        }
    }

    // Get the current state of the timer
    getState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            currentActivity: { ...this.currentActivity },
            elapsedTime: this.getElapsedTime()
        };
    }

    // Reset the timer completely
    reset() {
        clearInterval(this.timerInterval);
        this.startTime = null;
        this.pausedTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.currentActivity = {
            name: '',
            category: '',
            notes: '',
            startTime: null,
            endTime: null,
            duration: 0
        };
        this.updateTimerDisplay();
    }
}
