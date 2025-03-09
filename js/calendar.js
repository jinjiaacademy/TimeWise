// Calendar functionality and day analytics
document.addEventListener('DOMContentLoaded', function() {
    // Calendar elements
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    
    // Day analytics modal elements
    const dayAnalyticsModal = document.getElementById('day-analytics-modal');
    const dayAnalyticsTitle = document.getElementById('day-analytics-title');
    const dayTotalTime = document.getElementById('day-total-time');
    const dayMostCategory = document.getElementById('day-most-category');
    const dayActivityCount = document.getElementById('day-activity-count');
    const dayActivitiesList = document.getElementById('day-activities');
    
    // Close modal when clicking on the X
    dayAnalyticsModal.querySelector('.close-modal').addEventListener('click', function() {
        dayAnalyticsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === dayAnalyticsModal) {
            dayAnalyticsModal.style.display = 'none';
        }
    });
    
    // Current date and calendar state
    let currentDate = new Date();
    let selectedDate = new Date();
    let currentCalendarMonth = currentDate.getMonth();
    let currentCalendarYear = currentDate.getFullYear();
    
    // Initialize calendar
    renderCalendar(currentCalendarMonth, currentCalendarYear);
    
    // Event listeners for month navigation
    prevMonthButton.addEventListener('click', function() {
        currentCalendarMonth--;
        if (currentCalendarMonth < 0) {
            currentCalendarMonth = 11;
            currentCalendarYear--;
        }
        renderCalendar(currentCalendarMonth, currentCalendarYear);
    });
    
    nextMonthButton.addEventListener('click', function() {
        currentCalendarMonth++;
        if (currentCalendarMonth > 11) {
            currentCalendarMonth = 0;
            currentCalendarYear++;
        }
        renderCalendar(currentCalendarMonth, currentCalendarYear);
    });
    
    // Render the calendar for a given month and year
    function renderCalendar(month, year) {
        // Clear previous calendar days
        const dayElements = calendarGrid.querySelectorAll('.calendar-day');
        dayElements.forEach(day => day.remove());
        
        // Update month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of the month and total days in month
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Create empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyDay);
        }
        
        // Create calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            
            // Check if this day is today
            const isToday = day === currentDate.getDate() && 
                           month === currentDate.getMonth() && 
                           year === currentDate.getFullYear();
            
            if (isToday) {
                dayElement.classList.add('today');
            }
            
            // Check if this day has activities (will be implemented with data)
            checkDayForActivities(day, month, year).then(hasActivities => {
                if (hasActivities) {
                    dayElement.classList.add('has-activities');
                }
            });
            
            // Add click event to show day analytics
            dayElement.addEventListener('click', function() {
                const clickedDate = new Date(year, month, day);
                selectedDate = clickedDate;
                
                // Remove selected class from all days
                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('selected');
                });
                
                // Add selected class to clicked day
                dayElement.classList.add('selected');
                
                // Show day analytics modal
                showDayAnalytics(clickedDate);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Check if a specific day has activities
    async function checkDayForActivities(day, month, year) {
        const date = new Date(year, month, day);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Get entries for the day
        const entries = await getEntriesForTimeRange(startOfDay, endOfDay);
        return entries.length > 0;
    }
    
    // Get entries for a specific time range
    async function getEntriesForTimeRange(startTime, endTime) {
        try {
            const allEntries = await localForage.getItem('timeEntries') || [];
            return allEntries.filter(entry => {
                const entryStartTime = new Date(entry.startTime);
                const entryEndTime = new Date(entry.endTime);
                
                // Check if entry overlaps with the given time range
                return (entryStartTime >= startTime && entryStartTime <= endTime) || 
                       (entryEndTime >= startTime && entryEndTime <= endTime) ||
                       (entryStartTime <= startTime && entryEndTime >= endTime);
            });
        } catch (error) {
            console.error('Error getting entries for time range:', error);
            return [];
        }
    }
    
    // Show day analytics for a specific date
    async function showDayAnalytics(date) {
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        dayAnalyticsTitle.textContent = `Activities for ${formattedDate}`;
        
        // Get entries for the selected day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const entries = await getEntriesForTimeRange(startOfDay, endOfDay);
        
        // Calculate statistics
        let totalTimeInMinutes = 0;
        const categoryTimes = {};
        
        entries.forEach(entry => {
            const startTime = new Date(entry.startTime);
            const endTime = new Date(entry.endTime);
            const durationInMinutes = (endTime - startTime) / (1000 * 60);
            
            totalTimeInMinutes += durationInMinutes;
            
            if (categoryTimes[entry.category]) {
                categoryTimes[entry.category] += durationInMinutes;
            } else {
                categoryTimes[entry.category] = durationInMinutes;
            }
        });
        
        // Update statistics display
        const hours = Math.floor(totalTimeInMinutes / 60);
        const minutes = Math.round(totalTimeInMinutes % 60);
        dayTotalTime.textContent = `${hours}h ${minutes}m`;
        
        // Find category with most time
        let mostTimeCategory = 'N/A';
        let maxTime = 0;
        
        for (const category in categoryTimes) {
            if (categoryTimes[category] > maxTime) {
                maxTime = categoryTimes[category];
                mostTimeCategory = category;
            }
        }
        
        dayMostCategory.textContent = mostTimeCategory !== 'N/A' ? 
            mostTimeCategory.charAt(0).toUpperCase() + mostTimeCategory.slice(1) : 'N/A';
        
        dayActivityCount.textContent = entries.length;
        
        // Display activities list
        dayActivitiesList.innerHTML = '';
        
        if (entries.length === 0) {
            dayActivitiesList.innerHTML = '<p>No activities recorded for this day.</p>';
        } else {
            // Sort entries by start time
            entries.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            
            entries.forEach(entry => {
                const activityItem = document.createElement('div');
                activityItem.classList.add('activity-item');
                
                const startTime = new Date(entry.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const endTime = new Date(entry.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                activityItem.innerHTML = `
                    <div class="activity-header">
                        <span class="activity-name">${entry.name}</span>
                        <span class="activity-time">${startTime} - ${endTime}</span>
                    </div>
                    <div class="activity-category ${entry.category}">${entry.category}</div>
                    ${entry.notes ? `<div class="activity-notes">${entry.notes}</div>` : ''}
                `;
                
                dayActivitiesList.appendChild(activityItem);
            });
        }
        
        // Create and display chart for day's category distribution
        createDayCategoryChart(categoryTimes);
        
        // Show the modal
        dayAnalyticsModal.style.display = 'block';
    }
    
    // Create chart for day's category distribution
    function createDayCategoryChart(categoryTimes) {
        const ctx = document.getElementById('day-category-chart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (window.dayCategoryChart) {
            window.dayCategoryChart.destroy();
        }
        
        const categories = Object.keys(categoryTimes);
        const times = Object.values(categoryTimes);
        
        // Define colors for categories
        const categoryColors = {
            work: '#4a6fa5',
            study: '#6b8cae',
            personal: '#ff6b6b',
            health: '#4caf50',
            leisure: '#ff9800'
        };
        
        const colors = categories.map(category => categoryColors[category] || '#999999');
        
        window.dayCategoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
                datasets: [{
                    data: times,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time Distribution by Category',
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                    }
                }
            }
        });
    }
});
