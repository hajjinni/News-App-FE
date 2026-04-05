# Real-time News Alerts Application - Frontend

This is the **frontend** of a Real-time News Alerts application built using **React.js** and **Tailwind CSS**. It allows users to receive breaking news notifications in real-time, manage alert preferences, and view alert history.

---

## Features

### News Alerts System
- Real-time delivery of breaking news and notifications.
- Aggregates news from multiple sources or APIs.
- Live updates using **Socket.IO**.

### Customization Options
- Users can select news categories (e.g., Technology, Sports, Business).
- Set alert frequency: Immediate, Hourly Digest, Daily Digest.
- Enable or disable notification channels: Email, Push notifications.

### User Interface
- Dashboard to view recent alerts and alert history.
- Manage preferences for categories, frequency, and notification types.
- Interactive filters for live, unread, and categorized alerts.

### Notification Tools
- Integration with email services for alerts.
- Push notifications via browser or app.

---

## Tech Stack

- **Frontend:** React.js, React Hooks  
- **Styling:** Tailwind CSS  
- **Icons:** react-icons (Feather icons)  
- **HTTP Requests:** Axios (`api.js` service)  
- **Notifications:** react-hot-toast  
- **Real-time:** Socket.IO client  
- **State Management:** React Context (`useAuth` for user auth)  

---

## Setup & Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd frontend
