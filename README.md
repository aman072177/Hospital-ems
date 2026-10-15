# Hospital Emergency Management System

A web app that triages hospital patients with a **priority queue** and stores records in a **singly linked list**.

- **Emergency** patients are always treated first.
- **Normal** patients are treated in first-in, first-out order.
- Features: register patient, assign/change priority, treat next patient, view and delete records.

## Data structures
| Structure | File | Purpose |
|---|---|---|
| `PatientList` (linked list) | `structures.js` | Dynamic storage of all patient records |
| `Queue` (linked FIFO) | `structures.js` | One queue per priority level |
| `TriageQueue` | `structures.js` | Dequeues emergency queue first, then normal |

## Run locally
```bash
npm install
npm start
# open http://localhost:3000
```

## API
| Method | Route | Description |
|---|---|---|
| GET | `/api/state` | Waiting queue, records, stats |
| POST | `/api/patients` | Register `{name, age, complaint, priority}` |
| POST | `/api/treat-next` | Treat next patient |
| PATCH | `/api/patients/:id/priority` | Change priority |
| DELETE | `/api/patients/:id` | Delete record |

## Deploy on Render
1. Push this repo to GitHub.
2. On [render.com](https://render.com): **New → Web Service** → connect the repo.
3. Runtime: **Node**. Build command: `npm install`. Start command: `npm start`.
4. Click **Create Web Service**.

> Data is held in memory, so it resets when the server restarts (free Render instances also sleep when idle).
