/**
 * analytics.js
 * Handles data visualization and analytics for TimeWise
 */

// DOM Elements
const dailyViewBtn = document.getElementById('daily-view');
const weeklyViewBtn = document.getElementById('weekly-view');
const categoryChartCanvas = document.getElementById('category-chart');
const timeChartCanvas = document.getElementById('time-chart');
const totalTimeElement = document.getElementById('total-time');
const mostTimeCategoryElement = document.getElementById('most-time-category');
const activitiesCountElement = document.getElementById('activities-count');

// Chart instances
let categoryChart = null;
let timeChart = null;

// Current view mode
let currentViewMode = 'daily';

// Initialize analytics module
async function initAnalytics() {
    // Set up event listeners
    setupAnalyticsEventListeners();
    
    // Load initial data
    await loadAnalyticsData();
}

// Set up event listeners for analytics
function setupAnalyticsEventListeners() {
    // View mode buttons
    dailyViewBtn.addEventListener('click', () => {
        setViewMode('daily');
    });
    
    weeklyViewBtn.addEventListener('click', () => {
        setViewMode('weekly');
    });
}

// Set the view mode (daily or weekly)
async function setViewMode(mode) {
    if (mode === currentViewMode) return;
    
    currentViewMode = mode;
    
    // Update button states
    if (mode === 'daily') {
        dailyViewBtn.classList.add('active');
        weeklyViewBtn.classList.remove('active');
    } else {
        dailyViewBtn.classList.remove('active');
        weeklyViewBtn.classList.add('active');
    }
    
    // Reload data with new view mode
    await loadAnalyticsData();
}

// Load and display analytics data
async function loadAnalyticsData() {
    try {
        let entries = [];
        let dateRange = [];
        
        if (currentViewMode === 'daily') {
            // Get today's entries
            const today = new Date();
            entries = await TimeEntryStorage.getEntriesByDate(today);
            dateRange = [today];
        } else {
            // Get entries for the past 7 days
            entries = await getWeeklyEntries();
            dateRange = getLastSevenDays();
        }
        
        // Update charts and stats
        updateCategoryChart(entries);
        updateTimeChart(entries, dateRange);
        updateStatistics(entries);
    } catch (error) {
        console.error('Error loading analytics data:', error);
    }
}

// Get entries for the past 7 days
async function getWeeklyEntries() {
    try {
        const allEntries = await TimeEntryStorage.getAllEntries();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // 7 days including today
        oneWeekAgo.setHours(0, 0, 0, 0);
        
        return allEntries.filter(entry => {
            const entryDate = new Date(entry.startTime);
            return entryDate >= oneWeekAgo;
        });
    } catch (error) {
        console.error('Error getting weekly entries:', error);
        return [];
    }
}

// Get array of dates for the last 7 days
function getLastSevenDays() {
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
    }
    
    return dates;
}

// Update the category distribution chart
async function updateCategoryChart(entries) {
    // Group entries by category
    const categoryData = {};
    
    // Get all categories
    const categories = await CategoryStorage.getAllCategories();
    const categoryMap = {};
    categories.forEach(category => {
        categoryMap[category.id] = category;
        categoryData[category.id] = 0;
    });
    
    // Calculate total duration per category
    entries.forEach(entry => {
        const categoryId = entry.category || 'uncategorized';
        categoryData[categoryId] = (categoryData[categoryId] || 0) + entry.duration;
    });
    
    // Prepare chart data
    const labels = [];
    const data = [];
    const backgroundColor = [];
    
    for (const categoryId in categoryData) {
        if (categoryData[categoryId] > 0) {
            const category = categoryMap[categoryId] || { name: 'Uncategorized', color: '#999999' };
            labels.push(category.name);
            data.push(categoryData[categoryId]);
            backgroundColor.push(category.color);
        }
    }
    
    // Create or update chart
    if (categoryChart) {
        categoryChart.data.labels = labels;
        categoryChart.data.datasets[0].data = data;
        categoryChart.data.datasets[0].backgroundColor = backgroundColor;
        categoryChart.update();
    } else {
        categoryChart = new Chart(categoryChartCanvas, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const duration = formatDuration(value);
                                return `${label}: ${duration}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update the time spent per day chart
function updateTimeChart(entries, dateRange) {
    // Group entries by date
    const dailyData = {};
    
    // Initialize with zero for all dates
    dateRange.forEach(date => {
        const dateStr = date.toDateString();
        dailyData[dateStr] = 0;
    });
    
    // Calculate total duration per day
    entries.forEach(entry => {
        const entryDate = new Date(entry.startTime).toDateString();
        dailyData[entryDate] = (dailyData[entryDate] || 0) + entry.duration;
    });
    
    // Prepare chart data
    const labels = [];
    const data = [];
    
    for (const dateStr in dailyData) {
        const date = new Date(dateStr);
        labels.push(formatDate(date));
        data.push(dailyData[dateStr] / (1000 * 60 * 60)); // Convert to hours
    }
    
    // Create or update chart
    if (timeChart) {
        timeChart.data.labels = labels;
        timeChart.data.datasets[0].data = data;
        timeChart.update();
    } else {
        timeChart = new Chart(timeChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Hours',
                    data: data,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `${value.toFixed(2)} hours`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update summary statistics
async function updateStatistics(entries) {
    // Calculate total time
    const totalTime = entries.reduce((total, entry) => total + entry.duration, 0);
    totalTimeElement.textContent = formatDuration(totalTime);
    
    // Count activities
    activitiesCountElement.textContent = entries.length;
    
    // Find most time spent category
    if (entries.length > 0) {
        const categoryData = {};
        
        // Calculate total duration per category
        entries.forEach(entry => {
            const categoryId = entry.category || 'uncategorized';
            categoryData[categoryId] = (categoryData[categoryId] || 0) + entry.duration;
        });
        
        // Find category with maximum duration
        let maxDuration = 0;
        let maxCategoryId = null;
        
        for (const categoryId in categoryData) {
            if (categoryData[categoryId] > maxDuration) {
                maxDuration = categoryData[categoryId];
                maxCategoryId = categoryId;
            }
        }
        
        // Get category name
        if (maxCategoryId) {
            const categories = await CategoryStorage.getAllCategories();
            const category = categories.find(cat => cat.id === maxCategoryId);
            
            if (category) {
                mostTimeCategoryElement.textContent = category.name;
            } else {
                mostTimeCategoryElement.textContent = 'Uncategorized';
            }
        } else {
            mostTimeCategoryElement.textContent = 'N/A';
        }
    } else {
        mostTimeCategoryElement.textContent = 'N/A';
    }
}

// Format date as "Mon DD"
function formatDate(date) {
    const options = { weekday: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Format duration from milliseconds to human-readable format
function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Initialize the analytics module when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure storage.js has initialized
    setTimeout(initAnalytics, 200);
});
