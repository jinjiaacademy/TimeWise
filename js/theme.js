/**
 * theme.js
 * Handles theme switching and date/time display for TimeWise
 */

// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const themeLabel = document.getElementById('theme-label');
const currentDateTimeElement = document.getElementById('current-date-time');

// Initialize theme
function initTheme() {
    // Check for saved theme preference or use dark as default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
        themeLabel.textContent = 'Dark';
    } else {
        // Light theme
        document.body.removeAttribute('data-theme');
        themeSwitch.checked = false;
        themeLabel.textContent = 'Light';
    }
    
    // Set up event listener for theme toggle
    themeSwitch.addEventListener('change', toggleTheme);
    
    // Initialize date/time display
    updateDateTime();
    
    // Update date/time every second
    setInterval(updateDateTime, 1000);
}

// Toggle between light and dark theme
function toggleTheme() {
    if (themeSwitch.checked) {
        // Switch to dark theme
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeLabel.textContent = 'Dark';
    } else {
        // Switch to light theme
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeLabel.textContent = 'Light';
    }
}

// Update the date and time display
function updateDateTime() {
    const now = new Date();
    
    // Format date: Monday, March 9, 2025
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time: 10:35 AM
    const timeOptions = { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    
    // Update the DOM element
    currentDateTimeElement.innerHTML = `
        <div>${formattedDate}</div>
        <div>${formattedTime}</div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTheme);
