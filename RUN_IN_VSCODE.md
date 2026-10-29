# Run Samanvay in VS Code on this Linux machine

The complete project is in `/home/parag/Documents/ChatGPT/sih/samanvay`.
Dependencies, migrations and synthetic seed data have already been installed here.
Existing data is in `.local-data`; keep that directory when restarting.

## Start with VS Code tasks

1. Open this folder in VS Code.
2. Press `Ctrl+Shift+P`, select **Tasks: Run Task**, then **Samanvay: run all**.
3. Open <http://127.0.0.1:5173/>.
4. Sign in as `rb@demo.test` with password `DemoOnly-Stage2!`.

Three task terminals run the frontend, API and worker. To stop them, use
**Tasks: Terminate Task** for each service, or press `Ctrl+C` in each terminal.
Start only one copy of each service. If port 5173 or 8000 is already in use,
use the existing running app or stop its previous terminal before restarting.

## Start manually instead

Open three VS Code terminals from the project folder.

Frontend:

```bash
cd frontend
npm run dev
```

API:

```bash
cd backend
.venv-linux/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --no-access-log
```

Worker:

```bash
cd backend
.venv-linux/bin/python -m app.worker
```

Check the combined frontend/API path at <http://127.0.0.1:5173/api/health>.
It should return a JSON response with `"status":"ok"`.

## Useful folders

- `frontend/src/`: React screens, components and styles.
- `backend/app/`: API, business rules, matching, coordination and worker.
- `backend/migrations/`: database migrations.
- `docs/`: design, architecture, setup and workflow documentation.
- `.vscode/tasks.json`: the Linux launch tasks above.

## Checks

Frontend production build: `cd frontend && npm run build`.

The virtual environment is called `.venv-linux` on this machine. The original
`docs/SETUP.md` and PowerShell helper describe the repository author's Windows setup.
This application uses synthetic demo data and requires no paid API key.
