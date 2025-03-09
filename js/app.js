/**
 * app.js
 * Main application logic for TimeWise
 */

// Initialize the timer
const timer = new Timer();

// DOM Elements
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const stopTimerBtn = document.getElementById('stop-timer');
const activityNameInput = document.getElementById('activity-name');
const activityCategorySelect = document.getElementById('activity-category');
const activityNotesTextarea = document.getElementById('activity-notes');
const currentActivityElement = document.getElementById('current-activity');
const activityListElement = document.getElementById('activity-list');

// UI Navigation Elements
const categoriesSection = document.getElementById('categories-section');
const backToTrackingBtn = document.getElementById('back-to-tracking');
const mainContentContainer = document.querySelector('.main-content-container');

// Modal Elements
const entryModal = document.getElementById('entry-modal');
const modalTitle = document.getElementById('modal-title');
const entryForm = document.getElementById('entry-form');
const modalActivityName = document.getElementById('modal-activity-name');
const modalCategory = document.getElementById('modal-category');
const modalStartTime = document.getElementById('modal-start-time');
const modalEndTime = document.getElementById('modal-end-time');
const modalNotes = document.getElementById('modal-notes');
const cancelEntryBtn = document.getElementById('cancel-entry');
const closeModalBtn = document.querySelector('.close-modal');

// Current entry being edited
let currentEditingEntryId = null;

// Initialize the application
async function initApp() {
    // Load and display today's activities
    await loadTodayActivities();
    
    // Load categories into dropdowns
    await loadCategories();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners for UI interactions
function setupEventListeners() {
    // Timer control buttons
    startTimerBtn.addEventListener('click', handleStartTimer);
    pauseTimerBtn.addEventListener('click', handlePauseResumeTimer);
    stopTimerBtn.addEventListener('click', handleStopTimer);
    
    // Modal events
    entryForm.addEventListener('submit', handleSaveEntry);
    cancelEntryBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === entryModal) {
            closeModal();
        }
    });
    
    // Category management navigation
    activityCategorySelect.addEventListener('change', handleCategorySelectChange);
    backToTrackingBtn.addEventListener('click', showMainView);
}

// Load categories into dropdown selects
async function loadCategories() {
    try {
        const categories = await CategoryStorage.getAllCategories();
        
        // Clear existing options except the placeholder
        while (activityCategorySelect.options.length > 1) {
            activityCategorySelect.remove(1);
        }
        
        // Clear modal category options
        modalCategory.innerHTML = '';
        
        // Add categories to both dropdowns
        categories.forEach(category => {
            // Add to main dropdown
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            activityCategorySelect.appendChild(option);
            
            // Add to modal dropdown
            const modalOption = document.createElement('option');
            modalOption.value = category.id;
            modalOption.textContent = category.name;
            modalCategory.appendChild(modalOption);
        });
        
        // Add the manage categories option to the main dropdown
        const manageOption = document.createElement('option');
        manageOption.value = 'manage';
        manageOption.textContent = '➕ Manage categories...';
        manageOption.className = 'manage-option';
        activityCategorySelect.appendChild(manageOption);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load and display today's activities
async function loadTodayActivities() {
    try {
        const today = new Date();
        const activities = await TimeEntryStorage.getEntriesByDate(today);
        
        // Clear the activity list
        activityListElement.innerHTML = '';
        
        if (activities.length === 0) {
            // Show empty state
            activityListElement.innerHTML = '<div class="empty-state">No activities recorded today</div>';
            return;
        }
        
        // Sort activities by start time (newest first)
        activities.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        
        // Add each activity to the list
        activities.forEach(activity => {
            const activityElement = createActivityElement(activity);
            activityListElement.appendChild(activityElement);
        });
    } catch (error) {
        console.error('Error loading today\'s activities:', error);
    }
}

// Create an activity list item element
function createActivityElement(activity) {
    const activityElement = document.createElement('div');
    activityElement.className = 'activity-item';
    activityElement.dataset.id = activity.id;
    
    // Format times
    const startTime = new Date(activity.startTime);
    const endTime = new Date(activity.endTime);
    const duration = formatDuration(activity.duration);
    
    // Format time range
    const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    
    // Get category details
    const categoryClass = activity.category ? `category-${activity.category}` : '';
    
    activityElement.innerHTML = `
        <div class="activity-details">
            <div class="activity-name">${activity.name}</div>
            <div class="activity-time">${timeRange} (${duration})</div>
            <span class="activity-category ${categoryClass}">${activity.category || 'Uncategorized'}</span>
        </div>
        <div class="activity-actions">
            <button class="edit-activity" title="Edit"><i>✏️</i></button>
            <button class="delete-activity" title="Delete"><i>🗑️</i></button>
        </div>
    `;
    
    // Add event listeners for edit and delete buttons
    activityElement.querySelector('.edit-activity').addEventListener('click', () => {
        openEditModal(activity);
    });
    
    activityElement.querySelector('.delete-activity').addEventListener('click', () => {
        deleteActivity(activity.id);
    });
    
    return activityElement;
}

// Format time to HH:MM AM/PM
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Format duration from milliseconds to HH:MM:SS
function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

// Handle start timer button click
function handleStartTimer() {
    const activityName = activityNameInput.value.trim();
    const category = activityCategorySelect.value;
    const notes = activityNotesTextarea.value.trim();
    
    if (!activityName) {
        alert('Please enter an activity name');
        return;
    }
    
    // Start the timer
    const started = timer.start(activityName, category, notes);
    
    if (started) {
        // Update UI
        currentActivityElement.textContent = `Currently tracking: ${activityName}`;
        startTimerBtn.disabled = true;
        pauseTimerBtn.disabled = false;
        stopTimerBtn.disabled = false;
    }
}

// Handle pause/resume timer button click
function handlePauseResumeTimer() {
    const timerState = timer.getState();
    
    if (timerState.isRunning) {
        // Pause the timer
        timer.pause();
        pauseTimerBtn.textContent = 'Resume';
    } else if (timerState.isPaused) {
        // Resume the timer
        timer.resume();
        pauseTimerBtn.textContent = 'Pause';
    }
}

// Handle stop timer button click
async function handleStopTimer() {
    // Stop the timer and get the completed activity
    const completedActivity = timer.stop();
    
    if (completedActivity) {
        try {
            // Save the activity to storage
            await TimeEntryStorage.addEntry(completedActivity);
            
            // Reset UI
            currentActivityElement.textContent = 'No activity running';
            document.getElementById('timer').textContent = '00:00:00';
            startTimerBtn.disabled = false;
            pauseTimerBtn.disabled = true;
            pauseTimerBtn.textContent = 'Pause';
            stopTimerBtn.disabled = true;
            
            // Clear inputs
            activityNameInput.value = '';
            activityCategorySelect.value = '';
            activityNotesTextarea.value = '';
            
            // Reload activities
            await loadTodayActivities();
        } catch (error) {
            console.error('Error saving activity:', error);
            alert('Failed to save activity. Please try again.');
        }
    }
}

// Open the modal for adding a new entry
function openAddModal() {
    modalTitle.textContent = 'Add Time Entry';
    currentEditingEntryId = null;
    
    // Set default times
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    modalStartTime.value = formatDateTimeForInput(oneHourAgo);
    modalEndTime.value = formatDateTimeForInput(now);
    
    // Clear other fields
    modalActivityName.value = '';
    modalCategory.value = '';
    modalNotes.value = '';
    
    // Show the modal
    entryModal.style.display = 'block';
}

// Open the modal for editing an existing entry
function openEditModal(activity) {
    modalTitle.textContent = 'Edit Time Entry';
    currentEditingEntryId = activity.id;
    
    // Fill in the form with activity details
    modalActivityName.value = activity.name;
    modalCategory.value = activity.category || '';
    modalStartTime.value = formatDateTimeForInput(new Date(activity.startTime));
    modalEndTime.value = formatDateTimeForInput(new Date(activity.endTime));
    modalNotes.value = activity.notes || '';
    
    // Show the modal
    entryModal.style.display = 'block';
}

// Format date for datetime-local input
function formatDateTimeForInput(date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
}

// Close the modal
function closeModal() {
    entryModal.style.display = 'none';
    currentEditingEntryId = null;
}

// Handle save entry form submission
async function handleSaveEntry(event) {
    event.preventDefault();
    
    // Get form values
    const name = modalActivityName.value.trim();
    const category = modalCategory.value;
    const startTime = new Date(modalStartTime.value);
    const endTime = new Date(modalEndTime.value);
    const notes = modalNotes.value.trim();
    
    // Validate input
    if (!name) {
        showErrorMessage('Please enter an activity name');
        modalActivityName.focus();
        return;
    }
    
    if (!category) {
        showErrorMessage('Please select a category');
        modalCategory.focus();
        return;
    }
    
    if (isNaN(startTime.getTime())) {
        showErrorMessage('Please enter a valid start time');
        modalStartTime.focus();
        return;
    }
    
    if (isNaN(endTime.getTime())) {
        showErrorMessage('Please enter a valid end time');
        modalEndTime.focus();
        return;
    }
    
    if (startTime >= endTime) {
        showErrorMessage('Start time must be before end time');
        modalEndTime.focus();
        return;
    }
    
    // Calculate duration
    const duration = endTime.getTime() - startTime.getTime();
    
    try {
        if (currentEditingEntryId) {
            // Update existing entry
            const updatedEntry = {
                id: currentEditingEntryId,
                name,
                category,
                startTime,
                endTime,
                duration,
                notes
            };
            
            await TimeEntryStorage.updateEntry(updatedEntry);
            showSuccessMessage('Activity updated successfully');
        } else {
            // Add new entry
            const newEntry = {
                name,
                category,
                startTime,
                endTime,
                duration,
                notes
            };
            
            await TimeEntryStorage.addEntry(newEntry);
            showSuccessMessage('Activity added successfully');
        }
        
        // Close modal and reload activities
        closeModal();
        await loadTodayActivities();
    } catch (error) {
        console.error('Error saving entry:', error);
        showErrorMessage('Failed to save entry. Please try again.');
    }
}

// Delete an activity
async function deleteActivity(id) {
    if (confirm('Are you sure you want to delete this activity?')) {
        try {
            await TimeEntryStorage.deleteEntry(id);
            await loadTodayActivities();
            showSuccessMessage('Activity deleted successfully');
        } catch (error) {
            console.error('Error deleting activity:', error);
            showErrorMessage('Failed to delete activity. Please try again.');
        }
    }
}

// Display error message to user
function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error-color, #f44336)';
    errorElement.style.padding = '10px';
    errorElement.style.marginTop = '10px';
    errorElement.style.borderRadius = '4px';
    errorElement.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
    errorElement.style.position = 'fixed';
    errorElement.style.bottom = '20px';
    errorElement.style.right = '20px';
    errorElement.style.zIndex = '1000';
    errorElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    errorElement.style.animation = 'fadeIn 0.3s ease-out';
    
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add to body
    document.body.appendChild(errorElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }, 5000);
}

// Display success message to user
function showSuccessMessage(message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.color = 'var(--success-color, #4caf50)';
    successElement.style.padding = '10px';
    successElement.style.marginTop = '10px';
    successElement.style.borderRadius = '4px';
    successElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    successElement.style.position = 'fixed';
    successElement.style.bottom = '20px';
    successElement.style.right = '20px';
    successElement.style.zIndex = '1000';
    successElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    successElement.style.animation = 'fadeIn 0.3s ease-out';
    
    // Remove any existing success messages
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Add to body
    document.body.appendChild(successElement);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        successElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            successElement.remove();
        }, 300);
    }, 3000);
}

// Add a manual entry button to the UI
function addManualEntryButton() {
    const entriesSection = document.querySelector('.entries-section');
    const heading = entriesSection.querySelector('h2');
    
    const addButton = document.createElement('button');
    addButton.className = 'btn primary';
    addButton.textContent = 'Add Manual Entry';
    addButton.style.marginLeft = '10px';
    addButton.addEventListener('click', openAddModal);
    
    heading.appendChild(addButton);
}

// Handle category select change
function handleCategorySelectChange() {
    if (activityCategorySelect.value === 'manage') {
        // Reset the select to the first option
        activityCategorySelect.selectedIndex = 0;
        
        // Show the categories section
        showCategoriesView();
    }
}

// Show the main time tracking view
function showMainView() {
    categoriesSection.style.display = 'none';
    mainContentContainer.style.display = 'flex';
}

// Show the categories management view
function showCategoriesView() {
    categoriesSection.style.display = 'block';
    mainContentContainer.style.display = 'none';
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    addManualEntryButton();
    
    // Make sure we start with the main view
    showMainView();
});
