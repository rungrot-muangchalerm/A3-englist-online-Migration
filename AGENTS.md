# Agent Notes

When working on the EOL Phase 2 migration (refill, edit_profile, and related pages under `/EOL/eoltest`), follow the architecture in:

- `docs/framework/ARCHITECTURE.md`
- `docs/framework/ROUTING.md`
- `docs/framework/CONTRIBUTING.md`

## Quick Rules

- **EJS views** must contain HTML markup only. Do not implement form submission logic, redirects, or server-side error/success query-string handling in views.
- **Frontend routes/controllers** (`app/routes/frontend/`, `app/controller/eol/`) render the initial EJS layout and data. They must not process POST requests.
- **API routes/controllers** (`app/routes/api/`, `app/controller/api/`) receive JSON or `multipart/form-data`, call services, and return JSON.
- **Client-side code** must use `fetch()` with `credentials: 'include'`, chained `.then()` (no `async/await`), and update the DOM directly.

If in doubt, keep the original PHP visual layout but move all POST handling to `/api/eol/...` endpoints.

## Process & Logging

- **Do not kill running processes to inspect logs.** Always read logs from `server.log` (or the configured log file) instead of stopping the server or terminating tasks.
- If a background task/server needs to be stopped, use the provided task-management commands only when necessary, and never as a substitute for reading logs.
- **Do not start, restart, or spawn any server or background process if one is already running.** This includes dev servers, LiveReload, database proxies, or any process that binds to a port. Check first and avoid port collisions.
- **Do not edit files in a way that triggers an auto-restart of a running dev server** (e.g. nodemon + LiveReload) without explicit user consent.
- Always verify whether a server/process is already running before attempting to launch another instance.
