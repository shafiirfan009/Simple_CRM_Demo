# Orchestration Plan - SimpleCRM Demo

This document outlines the sequence of steps to build and run the SimpleCRM Demo using Node.js, Express, and SQLite. Follow these stages to develop the application systematically and ensure adherence to the defined scope.

## 1. Project Initialization
- Create a new project directory and navigate into it.
- Initialize a Node.js project:
  ```bash
  npm init -y
  ```
- Install dependencies:
  ```bash
  npm install express sqlite3
  ```
- Create the following folders in the project root:
  - `backend/` - server and database logic
  - `public/` - static HTML/CSS/JS
  - `data/` - storage for the SQLite database
- Copy the files `context.md`, `agent instruction.md`, and this `orchestration.md` into the project root. Do not modify `context.md`.

## 2. Database Layer
- Inside `backend/`, create `db.js`.
- Use the `sqlite3` module to connect to `data/leads.db`.
- On server start, run a SQL statement to create the `leads` table if it does not exist:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('New','Contacted','Closed')),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
```

- Export functions for:
  - `createLead(name, notes)` - Inserts a new lead with status `New` and timestamps.
  - `getAllLeads()` - Returns all leads.
  - `getLeadById(id)` - (Optional) Returns a single lead.
  - `updateLeadStatus(id, status)` - Updates a lead's status and `updated_at`.

## 3. Server Setup
- In `backend/server.js`, require Express and your database module.
- Configure Express to parse JSON bodies and serve static files from `public/`.
- Implement API routes:
  - `POST /api/leads` -> calls `createLead`, passing `name` and `notes` from the request body.
  - `GET /api/leads` -> calls `getAllLeads` and returns JSON.
  - `PUT /api/leads/:id` -> validates the provided `status` and updates the lead.
  - `GET /api/leads/:id` (optional) -> returns a single lead's details.
- Start the server on port `3000` (or another port if required).

## 4. Front-End Construction
- Create `public/index.html`, `public/add.html`, and `public/edit.html`.
- `index.html` - Dashboard:
  - On page load, fetch `/api/leads` and render a table of leads.
  - Each row should include an Edit link to `edit.html?id=<leadId>`.
  - Add a button linking to `add.html`.
- `add.html` - Add Lead Form:
  - Include inputs for `name` (required) and `notes` (optional).
  - On form submission, send a `POST` request to `/api/leads` via `fetch` or a normal form submission.
  - Redirect to the dashboard after creation.
- `edit.html` - Edit Lead Status:
  - Parse the query parameter `id` from the URL.
  - Fetch the lead's current data from `/api/leads/:id` or load from a global state if available.
  - Display `name` and `notes` as read-only.
  - Provide a dropdown with options `New`, `Contacted`, `Closed`.
  - On submission, send a `PUT` request to `/api/leads/:id` with the new status and then redirect back to the dashboard.
- Optionally, create a minimal `public/js/main.js` to share common fetch logic and handle redirection.
- Create `public/css/styles.css` to provide basic styling (for example, table layout and form spacing). No advanced responsiveness is required.

## 5. Testing and Validation
- Start the server:
  ```bash
  node backend/server.js
  ```
- Open `http://localhost:3000` in your browser and verify that the dashboard loads without errors.
- Add several leads via `add.html` and confirm they appear on the dashboard with status `New`.
- Edit a lead's status via `edit.html` and confirm the change appears in the dashboard and updates the `updated_at` timestamp.
- Refresh the browser or restart the server and ensure data persists in `data/leads.db`.
- Ensure that the application prevents status values outside of `New`, `Contacted`, or `Closed`.
- Confirm there are no options to delete leads, search/filter leads, or perform other out-of-scope actions.

## 6. Completion
When all tasks above are complete and the acceptance criteria in `context.md` are satisfied, the SimpleCRM Demo is ready for delivery. Do a final check that:
- The application runs with a single command (`node backend/server.js`) after installing dependencies.
- All required files (`context.md`, `agent instruction.md`, `orchestration.md`, `README.md`) are present in the project root.
- No additional features or complexity have been introduced beyond those described in the context document.
