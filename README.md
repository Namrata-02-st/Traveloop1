# Traveloop

Traveloop is a local-first travel planning web app for creating trips, ordering city stops, scheduling activities, tracking budgets, managing packing lists, writing trip notes, and sharing read-only public itineraries.

## Tech Stack

- Frontend: React 18, Vite, React Router, Zustand, Tailwind CSS, React Hook Form, Zod, Recharts, Lucide React, dnd-kit, Axios
- Backend: Node.js, Express, Sequelize, MySQL 8, JWT, bcryptjs, Multer, express-validator
- Tooling: ESLint, Prettier, Concurrently, Nodemon

## Prerequisites

- Node.js 20 LTS
- MySQL 8.x
- npm

This workspace currently works around PowerShell script policy by using `npm.cmd` instead of `npm`.

## Setup

1. Clone the repository.
2. Create the database:

```sql
CREATE DATABASE traveloop_db;
```

3. Copy environment examples and fill in local credentials:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. Install dependencies:

```bash
npm run install:all
```

5. Seed local data:

```bash
npm run seed
```

6. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000/api`

## Default Admin

The city seeder also prepares an admin account:

- Email: `admin@traveloop.com`
- Password: `Admin@1234`

## Git Workflow

- `main`: stable production-ready checkpoints
- `dev`: integration branch
- Feature branches target `dev`, for example:
  - `feature/auth-and-user`
  - `feature/trips-and-stops`
  - `feature/itinerary-builder`
  - `feature/budget-packing-notes`
  - `feature/frontend-auth-dashboard`
  - `feature/frontend-itinerary`

Use commit messages such as `feat: add stop reordering endpoint`, `fix: correct JWT expiry`, and `docs: update setup instructions`.

## API Reference

All responses use:

```json
{ "success": true, "data": {}, "message": "OK" }
```

or:

```json
{ "success": false, "error": "Validation failed", "details": [] }
```

| Group | Base Path | Main Capabilities |
|---|---|---|
| Auth | `/api/auth` | register, login, logout, me, password reset token |
| Users | `/api/users` | profile, avatar upload, saved destinations, account deactivation |
| Trips | `/api/trips` | trip CRUD, cover upload, sharing toggle, JSON export |
| Stops | `/api/trips/:tripId/stops` | list, add, update, delete, reorder |
| Stop Activities | `/api/stops/:stopId/activities` | list, add seeded/custom, schedule, delete |
| Cities | `/api/cities` | search cities, city detail, city activities |
| Activities | `/api/activities` | search seeded city activities |
| Budget | `/api/trips/:tripId/budget` | budget summary and budget cap updates |
| Packing | `/api/trips/:tripId/packing` | checklist CRUD and reset |
| Notes | `/api/trips/:tripId/notes` | trip and stop note CRUD |
| Share | `/api/share` | public itinerary view and copy |
| Admin | `/api/admin` | stats, users, trips, popular cities, user status |

## Local File Storage

Uploaded avatars and covers are stored under `server/uploads/avatars` and `server/uploads/covers`. The directories are kept in Git with `.gitkeep`, while uploaded files are ignored.
