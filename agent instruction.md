# Agent Instructions - SimpleCRM Demo

These instructions guide the development agent responsible for building the SimpleCRM Demo using Node.js, Express, and SQLite. The goal is to produce a minimal CRM that allows adding leads, viewing them in a dashboard, and updating lead statuses. Do not implement any features beyond those specified.

## Read the Context
- At the start of your session, open and read `context.md` in the project root. It defines the locked scope, data model, and build order. Do not alter this document.
- Use `context.md` as the authoritative reference; all decisions and implementations must comply with its constraints.

## Development Environment
- Initialize a Node.js project with `npm init -y` if it has not been done.
- Install required packages: `express` for routing, `sqlite3` for the database, and `body-parser` (or Express's built-in JSON parsing) for handling request bodies.
- Organize code into folders: `backend/` for server and database logic, `public/` for static HTML/CSS/JS files, and `data/` for the SQLite database file (`leads.db`).

## Implementation Steps
### Database Layer (`backend/db.js`)
- Establish a connection to `data/leads.db` using the `sqlite3` package.
- On startup, create a `leads` table with columns `id`, `name`, `notes`, `status`, `created_at`, and `updated_at` if it does not exist.
- Expose functions to create a lead, read all leads, read a lead by ID (optional), and update a lead's status.

### Server Setup (`backend/server.js`)
- Use Express to create an HTTP server and enable JSON body parsing.
- Serve static files from the `public/` directory (for example, `app.use(express.static('public'))`).
- Define API routes:
  - `POST /api/leads`: read `name` and `notes` from the request, set status to `New` if not provided, and store the lead using the database module.
  - `GET /api/leads`: return all leads as JSON.
  - `PUT /api/leads/:id`: accept a `status` value of `New`, `Contacted`, or `Closed` in the request body; update the lead and set `updated_at`.
  - `GET /api/leads/:id` (optional): return a single lead's data.
- Start the server on a specified port (for example, `3000`).

### Front-End Pages (`public/` folder)
- `index.html`: Implements the dashboard. On page load, fetch leads from `/api/leads`, display them in a table, and provide an Edit link/button that navigates to `edit.html?id=<id>`.
- `add.html`: Form for creating a new lead. Fields: `name` (required) and `notes`. On submission, send a `POST` request to `/api/leads` using `fetch` or a standard form and then redirect to the dashboard.
- `edit.html`: On load, parse the `id` query parameter, fetch the corresponding lead data from `/api/leads/:id` or from local state if preloaded, display name/notes, and present a dropdown for status. On form submission, send a `PUT` request to `/api/leads/:id` with the new status and return to the dashboard.
- `css/styles.css`: Minimal styling for readability; no complex layouts or responsive design.
- `js/main.js` (optional): Shared scripts for performing fetch requests and handling redirects.

## Constraints
- Only the fields `name`, `notes`, and `status` are allowed. Do not add additional fields or statuses.
- Do not implement delete functionality, search/filtering, analytics, user accounts, or any other CRM features.
- Do not integrate third-party services or libraries beyond those required (`Express` and `SQLite`). No front-end frameworks are needed.
- Maintain simplicity: vanilla JavaScript and basic HTML are sufficient for the front end.

## Checklist for Completion
- [ ] `context.md` and `agent instruction.md` reside in the project root, unmodified.
- [ ] A Node.js application runs via `node backend/server.js` and creates/uses `data/leads.db`.
- [ ] The dashboard lists all leads with their name, status, creation date, and last updated date.
- [ ] The add lead page creates a new lead and redirects to the dashboard.
- [ ] The edit lead page updates only the status and updates `updated_at` accordingly.
- [ ] Status values are strictly limited to `New`, `Contacted`, or `Closed`.
- [ ] No extra features or UI elements beyond those specified appear in the final application.
