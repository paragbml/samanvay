# SIH recording walkthrough

The running local database contains 36 additional fictional complaints across six fictional institutions, with 54 stored evidence files, six shared plans, six pending transfers, six pair reviews (three confirmed related; three awaiting review), six completed resolutions, and six notifications per showcase role. The institution directory also retains the existing reference institutions. It is a representative demo directory, not a complete or live AICTE registry.

All six sign-in roles have explicit read access to **these showcase records only**. Ownership and action permissions remain role-specific. Existing user cases and permissions were not reset.

## Suggested recording sequence

1. **Case officer** (`rb@demo.test`): Work queue → overdue filter → `SIH-01-001`. Show the Hindi letter and case note under Supporting files, owner, deadline, next step, and activity history.
2. **Grievance officer** (`pgrc@demo.test`): Open `SIH-01-002`, then `SIH-01-004` for the Marathi letter. Open Transfers to demonstrate incoming requests. Accepting a transfer changes saved state; do this only when ready to record that action.
3. **Coordinator** (`coordinator@demo.test`): Coordination → select a shared plan. Show the lead and next action, then Evidence reviews. The Pune pair is confirmed related; the Nagpur pair awaits review. In Dependency map switch between Shared plan and Evidence relationships, select nodes/lines and demonstrate zoom.
4. **Supervisor** (`supervisor@demo.test`): Show the bureau queue and assignment/supervisor controls. Shared records do not make the supervisor the case owner.
5. **Management** (`management@demo.test`): Reports → show status, ageing, bureau, region and institution summaries, then exports and closed cases. Reports are calculated from authorised persisted records.
6. **Administrator** (`admin@demo.test`): Settings → policy and operational controls, Notifications, then the explicitly delegated showcase records. Administrative membership alone still does not grant complaint access.

Use the existing demo password `DemoOnly-Stage2!`. Each demo-account button fills it automatically.

## Re-running the scenario loader

From `backend`, run `.venv-linux/bin/python -m app.seed_showcase`. It skips existing case IDs and preserves subsequent edits, transfer decisions and review outcomes. It does not reset the recording. Dates are relative to the initial import; re-running does not move deadlines. A database backup was taken under `.local-data/backups` before the first import.

Evidence is explicitly synthetic and stored through the application's private evidence mechanism with checksums. Handwritten images are illustrative templates; the case-specific text notes carry each scenario's details. No real complaints, official AICTE integration or live institutional allegations are represented.
