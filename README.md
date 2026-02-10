# mySprintApp
# This app is for project management through sprint planning 
# Zoho Sprints–Like Scrum Board Application

## Project Goal
Build a web-based Agile project planning tool similar to **Zoho Sprints** with:
- Backlog management
- Sprint planning
- Scrum board with drag-and-drop
- User roles
- Reports (burndown, velocity)

The application must support multiple projects and teams.

---

## Tech Stack

### Frontend
- React + TypeScript
- Material UI (MUI)
- @dnd-kit for drag and drop
- Redux Toolkit for state management
- Axios for API calls

### Backend
- Node.js
- NestJS framework
- REST APIs
- JWT authentication
- Socket.IO for real-time updates

### Database
- PostgreSQL
- Prisma ORM

---

## Core Entities

### User
- id (UUID)
- name
- email
- passwordHash
- role (ADMIN, MEMBER, VIEWER)

### Organization
- id
- name
- ownerId

### Project
- id
- organizationId
- name
- key (e.g. SCRUM)
- startDate
- endDate

### Sprint
- id
- projectId
- name
- startDate
- endDate
- status (PLANNED, ACTIVE, COMPLETED)

### Epic
- id
- projectId
- name
- description

### WorkItem
- id
- projectId
- sprintId (nullable)
- epicId (nullable)
- type (STORY, TASK, BUG)
- title
- description
- status (BACKLOG, TODO, IN_PROGRESS, DONE)
- priority
- storyPoints
- assigneeId
- position

### WorkItemHistory
- id
- workItemId
- oldStatus
- newStatus
- changedAt

---

## Application Pages

### Authentication
- Login
- Register

### Organization
- Create organization
- Invite users
- Assign roles

### Project
- Project dashboard
- Project settings

### Backlog
- Create and manage epics
- Create backlog work items
- Assign story points

### Sprint Board
- Columns:
  - Backlog
  - To Do
  - In Progress
  - Done
- Drag and drop work items
- Live updates across users

### Reports
- Sprint burndown chart
- Velocity chart

---

## Scrum Board Rules

- Only backlog items can be added to a sprint
- Sprint must be ACTIVE to move items
- DONE items are read-only
- Sprint backlog is locked after sprint start
- Each drag action updates:
  - status
  - sprintId
  - position
  - history record

---

## REST API Endpoints

### Auth
- POST /auth/login
- POST /auth/register
- POST /auth/refresh

### Organization
- POST /organizations
- POST /organizations/:id/invite

### Projects
- POST /projects
- GET /projects
- GET /projects/:id

### Sprints
- POST /projects/:id/sprints
- PATCH /sprints/:id/start
- PATCH /sprints/:id/complete

### Work Items
- POST /work-items
- PATCH /work-items/:id
- PATCH /work-items/:id/move
- DELETE /work-items/:id

---

## Drag & Drop Logic

When a work item is dropped:
- Update status based on column
- Update position index
- Save history entry
- Broadcast update via WebSocket

---

## Real-Time Events (Socket.IO)

- workItemCreated
- workItemUpdated
- workItemMoved
- sprintStarted
- sprintCompleted

---

## Role Permissions

### Admin
- Create projects
- Create sprints
- Manage users

### Member
- Create and update work items
- Move items on board

### Viewer
- Read-only access

---

## Non-Functional Requirements

- Responsive UI
- Secure authentication
- Audit trail for status changes
- Scalable architecture

---

## Development Phases

### Phase 1
- Authentication
- Project creation
- Backlog management

### Phase 2
- Sprint board
- Drag and drop
- Role management

### Phase 3
- Reports
- Real-time collaboration
- UI/UX polish

---

## Inspiration
- Zoho Sprints
- Jira Scrum Board
- Linear.app

---

## Expected Outcome
A production-ready Scrum board application that supports real-world Agile project planning similar to Zoho Sprints.
