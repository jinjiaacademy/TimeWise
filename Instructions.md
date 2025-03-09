Instruction Prompt for Time Management App (Windsurf, MVP focused)

⸻

1. Project Overview
	•	Brief Description:
Develop a minimalist time management application based on the Lyubishev Time-Tracking Method, enabling precise logging, categorization, and basic analysis of daily activities to improve personal efficiency and self-awareness.
	•	Target Users:
Individuals who want to manage and analyze their personal time usage meticulously, aiming to increase productivity and self-improvement through accurate time-tracking and simple data visualization.
	•	Primary Goal:
Facilitate precise, user-friendly tracking of daily tasks with basic reporting to help users understand their time expenditure clearly, enabling actionable insights for self-improvement.
	•	Scope:
	•	MVP Version (initial release):
	•	Quick task time-tracking (start/stop logging)
	•	Customizable task/activity categorization
	•	Basic daily/weekly summaries of logged time
	•	Simple visual data analysis (charts)
	•	Future Enhancements:
	•	Advanced analytics and insights
	•	Cloud synchronization and backup
	•	Cross-platform support (Mobile apps)
	•	Intelligent reminders and notifications
	•	Export reports (PDF, CSV)

⸻

2. Core Functionalities

⏱️ Function 1: Time Tracking
	•	Description:
Users can quickly start and stop a timer for their activities or manually enter time spent.
	•	Functional Requirements:
	•	Start, pause, stop timer functionality.
	•	Manual addition/editing of time records.
	•	Handling overlaps and corrections.
	•	Data Handling:
	•	Input: Activity name, start/end time, optional notes.
	•	Output: Saved time-log entries.
	•	Storage: Local IndexedDB (initial MVP).
	•	UI Layout/Elements:
	•	Main page with “Start Timer” button.
	•	Active timer indicator.
	•	Quick-add/edit entry dialog.
	•	API/Integration Requirements:
	•	No external API integration required in MVP.
	•	Implementation Steps:
	1.	Set up frontend page & state management.
	2.	Timer logic (start/stop/pause).
	3.	CRUD operations for time entries.
	•	Technologies:
	•	Windsurf, React, TypeScript
	•	IndexedDB (via localForage or similar)
	•	Testing Considerations:
	•	Unit tests for timer logic.
	•	Integration tests for CRUD operations.
	•	Reference:
	•	localForage Documentation

⸻

📂 Function 2: Activity Categorization
	•	Description:
Allow users to define and assign categories for each recorded activity.
	•	Functional Requirements:
	•	Pre-defined default categories.
	•	CRUD operations for categories.
	•	Assign categories quickly during time tracking.
	•	Data Handling:
	•	Input: Category name, parent category (optional).
	•	Output: Categorized time entries.
	•	Storage: IndexedDB (local storage).
	•	UI Layout/Elements:
	•	Categories management panel.
	•	Dropdown selection during task logging.
	•	Implementation Steps:
	1.	Develop category management module (create/edit/delete).
	2.	Link category data with time-log entries.
	•	Technologies:
	•	React Components in Windsurf
	•	IndexedDB storage via localForage
	•	Testing Considerations:
	•	CRUD operation tests for category management.
	•	Category selection consistency.
	•	Reference:
	•	React Select component

⸻

📊 Function 3: Basic Analytics Dashboard
	•	Description:
Visual representation (charts) of daily and weekly activities to help users analyze their time distribution.
	•	Functional Requirements:
	•	Daily and weekly summary (pie chart, bar chart).
	•	Basic reporting: total logged time per category.
	•	Data Handling:
	•	Input: Stored time-log entries.
	•	Output: Aggregated data for visualization.
	•	UI Layout/Elements:
	•	Simple dashboard with daily/weekly toggle.
	•	Charts displaying time spent per category.
	•	API/Integration Requirements:
	•	No external API in MVP; internal data processing only.
	•	Implementation Steps:
	1.	Retrieve and aggregate data from IndexedDB.
	2.	Implement charts using Chart.js or ECharts.
	•	Technologies:
	•	Windsurf, React
	•	Chart.js or Apache ECharts
	•	Testing Considerations:
	•	Data aggregation logic.
	•	Visualization accuracy checks.
	•	Reference:
	•	Chart.js Documentation

⸻

3. Documentation
	•	Sample Codes:
	•	Timer management (start/stop logic).
	•	Data storage examples (IndexedDB via localForage).
	•	Chart rendering examples (Chart.js).
	•	Sample Documents:
	•	UI wireframes/mockups (Figma).
	•	Data model definition.
	•	Support Document Structure:
	•	README.md with setup instructions.
	•	API/Data interaction guidelines.
	•	Component documentation within codebase.
	•	User Guide (MVP):
	•	Quick start guide: Logging activities.
	•	Managing categories.
	•	Viewing reports.

⸻

4. Important Implementation Notes
	•	Environment Variables:
	•	No sensitive variables for MVP; future DB credentials or cloud integration variables.
	•	Performance Considerations:
	•	Optimize IndexedDB queries to maintain app responsiveness.
	•	Debounce rapid user actions for better UX.
	•	Error Handling:
	•	Provide informative user-friendly error messages.
	•	Validate user inputs to prevent faulty data entries.
	•	Security:
	•	Basic sanitization of inputs.
	•	Future considerations for data encryption.
	•	Logging & Monitoring:
	•	Implement simple logging in console during development (expandable later).
	•	Deployment & CI/CD:
	•	Deploy using Windsurf’s built-in deployment tools or via Vercel.
	•	Basic CI/CD pipeline (GitHub Actions for automated deployments).

⸻

🚀 Technologies Recommended (MVP Stack)
	•	Frontend:
	•	Windsurf (based on Next.js & React)
	•	TypeScript (for robust development)
	•	Database (Local):
	•	IndexedDB (using localForage)
	•	Visualization:
	•	Chart.js or Apache ECharts
	•	Deployment Platform:
	•	Windsurf built-in deployment / Vercel

⸻