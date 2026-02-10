import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { ScrumService } from './scrumService.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const scrum = new ScrumService();

app.use(express.json());

app.post('/auth/register', (_req, res) => {
  res.status(501).json({ message: 'Register not implemented. Integrate JWT and persistence.' });
});
app.post('/auth/login', (_req, res) => {
  res.status(501).json({ message: 'Login not implemented. Integrate JWT and persistence.' });
});
app.post('/auth/refresh', (_req, res) => {
  res.status(501).json({ message: 'Refresh not implemented.' });
});

app.post('/projects', (req, res) => {
  const project = scrum.createProject(req.body);
  res.status(201).json(project);
});
app.get('/projects', (_req, res) => {
  res.json(scrum.listProjects());
});
app.get('/projects/:id', (req, res) => {
  const project = scrum.getProject(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

app.post('/projects/:id/sprints', (req, res) => {
  const sprint = scrum.createSprint(req.params.id, req.body.name);
  res.status(201).json(sprint);
});
app.patch('/sprints/:id/start', (req, res) => {
  const sprint = scrum.updateSprintStatus(req.params.id, 'ACTIVE');
  io.emit('sprintStarted', sprint);
  res.json(sprint);
});
app.patch('/sprints/:id/complete', (req, res) => {
  const sprint = scrum.updateSprintStatus(req.params.id, 'COMPLETED');
  io.emit('sprintCompleted', sprint);
  res.json(sprint);
});

app.post('/work-items', (req, res) => {
  const item = scrum.createWorkItem(req.body);
  io.emit('workItemCreated', item);
  res.status(201).json(item);
});
app.patch('/work-items/:id', (req, res) => {
  const item = scrum.patchWorkItem(req.params.id, req.body);
  io.emit('workItemUpdated', item);
  res.json(item);
});
app.patch('/work-items/:id/move', (req, res) => {
  const item = scrum.moveWorkItem(req.params.id, req.body);
  io.emit('workItemMoved', item);
  res.json(item);
});
app.delete('/work-items/:id', (req, res) => {
  scrum.deleteWorkItem(req.params.id);
  res.status(204).send();
});

app.get('/projects/:id/board', (req, res) => {
  const items = scrum.listWorkItems(req.params.id);
  res.json({
    BACKLOG: items.filter((i) => i.status === 'BACKLOG'),
    TODO: items.filter((i) => i.status === 'TODO'),
    IN_PROGRESS: items.filter((i) => i.status === 'IN_PROGRESS'),
    DONE: items.filter((i) => i.status === 'DONE')
  });
});

app.get('/work-items/:id/history', (req, res) => {
  res.json(scrum.listHistory(req.params.id));
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(400).json({ message: err.message });
});

const port = Number(process.env.PORT ?? 4000);
httpServer.listen(port, () => {
  console.log(`mySprintApp API listening on ${port}`);
});
