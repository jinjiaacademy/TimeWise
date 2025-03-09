# TimeWise

![TimeWise App](https://img.shields.io/badge/App-TimeWise-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern, minimalist time management application based on the Lyubishev Time-Tracking Method. TimeWise enables precise logging, categorization, and analysis of daily activities to improve personal efficiency and self-awareness with a beautiful, peaceful user interface.

## 🌟 Features

- ⏱️ **Time Tracking**: Start, pause, and stop timers for activities with manual entry option
- 📂 **Activity Categorization**: Organize activities with customizable categories
- 📊 **Analytics Dashboard**: Visual representation of time distribution with daily and weekly views
- 📅 **Calendar View**: Track your productivity patterns across days and weeks
- 🌓 **Dark Mode**: Elegant dark theme for comfortable use at any time of day (default)
- 📈 **Summary Statistics**: Track total time, most used categories, and activity completion
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

Experience TimeWise: [Live Demo](https://jinjiaacademy.github.io/TimeWise)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: IndexedDB (via localForage)
- **Visualization**: Chart.js
- **Design**: Custom CSS with responsive design principles

## 🏁 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/jinjiaacademy/TimeWise.git
   ```

2. Navigate to the project directory:
   ```bash
   cd TimeWise
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 8080
   ```
   Then visit `http://localhost:8080` in your browser.

## 📂 Project Structure

```
/
├── index.html          # Main application entry point
├── about.html          # About page with information on the Lyubishev method
├── css/                # Stylesheets
│   ├── styles.css      # Main stylesheet
│   └── about.css       # About page styles
├── js/                 # JavaScript files
│   ├── app.js          # Main application logic
│   ├── timer.js        # Timer functionality
│   ├── storage.js      # IndexedDB interactions
│   ├── categories.js   # Category management
│   ├── analytics.js    # Data visualization and analytics
│   ├── calendar.js     # Calendar view functionality
│   └── theme.js        # Theme switching functionality
└── README.md           # Project documentation
```

## 📖 How to Use

1. **Start Tracking**: Enter an activity name, select a category, and click "Start Timer"
2. **Pause/Resume**: Use the pause button to temporarily stop the timer and resume when ready
3. **Complete Activity**: Click "Stop" to finish and save the activity
4. **View Analytics**: Check your time distribution in the analytics dashboard
5. **Manage Categories**: Customize your activity categories for better organization
6. **Switch Themes**: Toggle between light and dark modes using the theme switch

## 🔮 Future Enhancements

- Advanced analytics and insights with machine learning recommendations
- Cloud synchronization and backup
- Cross-platform mobile apps (iOS/Android)
- Intelligent reminders and notifications
- Export reports (PDF, CSV, JSON)
- Team collaboration features
- Integration with productivity tools

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- The Lyubishev Time-Tracking Method for the inspiration
- Chart.js for the visualization capabilities
- localForage for simplified IndexedDB interactions
