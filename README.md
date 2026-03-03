# SimpleCRM Demo

SimpleCRM Demo is a lightweight, single-user CRM application designed for demonstration purposes. It allows a user to add a lead, view all leads in a dashboard, and update each lead's status. The project is intentionally minimal: there is no authentication, multi-user support, or advanced CRM features. This demo uses Node.js, Express, and SQLite for quick setup and local persistence.

## Features
- Add Lead: Create a new lead with a name and optional notes. The status defaults to `New`.
- Dashboard: View all leads with their name, status (`New`, `Contacted`, or `Closed`), and timestamps.
- Update Status: Change a lead's status to `New`, `Contacted`, or `Closed`.

## Technology
- Backend: Node.js with Express for routing.
- Database: SQLite accessed via the `sqlite3` package.
- Frontend: Static HTML, CSS, and vanilla JavaScript served from the `public/` directory.

## Installation
1. Clone the repository and navigate to the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   node backend/server.js
   ```
4. Open your browser and go to `http://localhost:3000` to access the dashboard.

The server will automatically create a `data/leads.db` SQLite database file if it does not exist.

## Project Structure
```text
.
├── backend/
│   ├── server.js          # Express server and API routes
│   └── db.js              # SQLite setup and data helper functions
├── data/
│   └── leads.db           # SQLite database (created at runtime)
├── public/
│   ├── index.html         # Dashboard page
│   ├── add.html           # Add lead page
│   ├── edit.html          # Edit lead page
│   ├── css/
│   │   └── styles.css     # Basic styling
│   └── js/
│       └── main.js        # Optional client-side logic
├── context.md             # Locked scope and design document (do not modify)
├── agent instruction.md   # Instructions for the development agent
└── README.md              # Project summary and setup instructions
```

## Usage
- Add a Lead: Navigate to `/add`, enter the lead's name and optional notes, and submit. You will be redirected to the dashboard.
- Edit a Lead: In the dashboard, click the Edit button next to a lead. Select the new status and save.

## Notes
- This is a demo project for a single user; there is no authentication or data deletion.
- Only the three statuses `New`, `Contacted`, and `Closed` are allowed.
- Feel free to explore the code, but avoid adding features outside the defined scope outlined in `context.md`.
