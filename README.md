# mySprintApp

Starter backend implementation for a Zoho Sprints–like Scrum board application.

## What is implemented
- TypeScript Node.js API with Express.
- Core entities represented in TypeScript models.
- In-memory Scrum service for projects, sprints, work items, and work item history.
- REST endpoints aligned with the original specification:
  - `POST /projects`, `GET /projects`, `GET /projects/:id`
  - `POST /projects/:id/sprints`
  - `PATCH /sprints/:id/start`, `PATCH /sprints/:id/complete`
  - `POST /work-items`, `PATCH /work-items/:id`, `PATCH /work-items/:id/move`, `DELETE /work-items/:id`
- Socket.IO events:
  - `workItemCreated`, `workItemUpdated`, `workItemMoved`, `sprintStarted`, `sprintCompleted`
- Scrum board move rules in service layer:
  - DONE items are read-only.
  - Sprint must be ACTIVE for sprint item moves.
  - Status changes create history records.

## Quick start
```bash
npm install
npm run start
```

Server runs at `http://localhost:4000`.

## Notes
- This is a starter implementation to bootstrap development from the product requirements.
- Auth, RBAC enforcement, persistence (Prisma/PostgreSQL), frontend, and reporting are scaffold-level and not fully implemented.
