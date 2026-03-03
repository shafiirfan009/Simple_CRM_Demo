# SimpleCRM Demo - Pre-Build Document

## Product Overview
SimpleCRM Demo is a lightweight, single-user proof-of-concept CRM for demonstration purposes. It allows a user to create a lead, display all leads in a simple dashboard, and update each lead's status among `New`, `Contacted`, or `Closed`. There is no authentication or multi-user access; all data is stored locally using a simple persistence mechanism for rapid prototyping.

## Non-Goals
- No user accounts: no login, signup, password management, roles, or permissions.
- No collaboration: only one user; no sharing or multi-user views.
- No advanced CRM features: no tasks, reminders, emails, tags, notes, deal value, pipelines, analytics, or reports.
- No integrations: no external services, third-party APIs, or plugins.
- No search or filtering features: all leads display in one list without sorting or filtering.
- No responsive design tailoring: basic desktop layout; mobile optimization is out of scope.
- No scalability concerns: performance for a small dataset is acceptable; there is no optimization for large datasets or concurrent access.

## User Flow
- Add Lead: The user navigates to the Add Lead page, fills out a form with the lead's name and optional notes, selects a default status of `New`, and submits.
- Dashboard: After submission, the user is redirected to the dashboard. The new lead appears in the list of all leads, showing name, status, creation date, and last updated timestamp.
- Update Status: On the dashboard, each lead has an Edit button. Clicking it opens a simple form allowing the user to select one of the three statuses (`New`, `Contacted`, `Closed`). After saving, the dashboard reloads with the updated status.

## Data Model
A single table or collection suffices:

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Auto-increment primary key |
| `name` | string | Lead's name (required) |
| `notes` | string | Optional notes |
| `status` | string | One of `New`, `Contacted`, `Closed` |
| `created_at` | datetime | Timestamp when the lead was created |
| `updated_at` | datetime | Timestamp when the lead was last updated |

Persistence can be implemented with SQLite, Supabase, or a JSON file. For a rapid demo, SQLite or JSON is sufficient.

## Pages and UI Structure
- Dashboard Page (`/`):
  - Lists all leads in a table or list.
  - Columns: Name, Status, Created At, Updated At, and an Edit link/button.
  - Add Lead button/link at top.
- Add Lead Page (`/add`):
  - Form fields: Name (input text), Notes (textarea), Status (pre-selected as `New`).
  - Submit button to create the lead and redirect to the dashboard.
- Edit Lead Page (`/edit/:id`):
  - Displays name and notes for context (read-only or editable, but only status updates are required).
  - Dropdown/select for status with allowed values `New`, `Contacted`, or `Closed`.
  - Save button updates the lead and returns to the dashboard.

## API / Data Operations Required
- Create Lead: Insert a new lead into the database or JSON file with the provided name, notes, status, and timestamps.
- Read All Leads: Retrieve all leads to populate the dashboard.
- Update Lead Status: Update the `status` and `updated_at` fields for a given lead.
- Optional Read Single Lead: Retrieve a lead by `id` for editing (can also be derived client-side).
- No delete operation, authentication endpoints, or advanced CRUD features are included.

## Build Order
1. Set Up Project: Initialize a minimal web application framework or static site with routing. Set up the data storage (SQLite file or JSON) and simple data access layer.
2. Define Data Model: Create the leads table or JSON structure with fields defined above.
3. Build Dashboard Page: Implement the UI to list leads and link to Add and Edit. Add placeholder actions for editing.
4. Create Lead Form: Implement the Add Lead page with form submission that writes to the data store and redirects to the dashboard.
5. Implement Status Update: Build the Edit Lead page to update the status and persist the change.
6. Wire Data Operations: Connect UI actions to backend functions to create and update leads; ensure timestamps update correctly.
7. Test End-to-End Flow: Add sample leads, verify display and status updates, and ensure the three allowed statuses are enforced.

## Acceptance Criteria
- Create Flow: A user can navigate to the Add Lead page, input a name, optionally add notes, and submit. The lead appears in the dashboard with the status `New`.
- Dashboard Listing: All leads appear with correct fields. Each lead shows an Edit link/button.
- Status Update Flow: Editing a lead allows status to be changed only to `New`, `Contacted`, or `Closed`. After saving, the dashboard displays the updated status.
- Persistence: Data remains across page reloads. Timestamps reflect when leads were created and last updated.
- Single User: No authentication prompts or multi-user features are visible.
- UI Simplicity: UI elements strictly follow the described pages without extra fields or options.

## Anti-Scope-Drift Rules
- Do not add any fields or statuses beyond those specified. The only statuses allowed are `New`, `Contacted`, and `Closed`.
- Do not add deletion, search, filtering, sorting, or export features.
- Do not implement user accounts, login screens, or session management.
- Do not include notifications, email integrations, or other CRM functionalities.
- Keep the codebase minimal and direct; do not refactor for extensibility beyond the defined scope.

## Deployment Criteria
- The application must be runnable locally with minimal setup (single command or script).
- All dependencies are documented in a single configuration (e.g., `package.json` for Node.js or requirements file for Python).
- Database or JSON storage is created automatically if it does not exist.
- The server serves the UI and handles data operations without requiring external services.
- Deployment is for demonstration only; performance optimization and security hardening are out of scope.
