import { v4 as uuid } from 'uuid';
import { Project, Sprint, WorkItem, WorkItemHistory, WorkItemStatus } from './types.js';

export class ScrumService {
  private projects = new Map<string, Project>();
  private sprints = new Map<string, Sprint>();
  private workItems = new Map<string, WorkItem>();
  private history: WorkItemHistory[] = [];

  createProject(input: Omit<Project, 'id'>): Project {
    const project = { id: uuid(), ...input };
    this.projects.set(project.id, project);
    return project;
  }

  listProjects(): Project[] {
    return [...this.projects.values()];
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  createSprint(projectId: string, name: string): Sprint {
    const sprint: Sprint = {
      id: uuid(),
      projectId,
      name,
      status: 'PLANNED'
    };
    this.sprints.set(sprint.id, sprint);
    return sprint;
  }

  updateSprintStatus(sprintId: string, status: Sprint['status']): Sprint {
    const sprint = this.mustSprint(sprintId);
    sprint.status = status;
    this.sprints.set(sprint.id, sprint);
    return sprint;
  }

  createWorkItem(input: Omit<WorkItem, 'id' | 'position'>): WorkItem {
    const position = this.nextPosition(input.projectId, input.sprintId, input.status);
    const item: WorkItem = { id: uuid(), position, ...input };
    this.workItems.set(item.id, item);
    return item;
  }

  patchWorkItem(id: string, patch: Partial<WorkItem>): WorkItem {
    const item = this.mustItem(id);
    const merged = { ...item, ...patch };
    this.workItems.set(id, merged);
    return merged;
  }

  deleteWorkItem(id: string): void {
    this.workItems.delete(id);
  }

  moveWorkItem(workItemId: string, next: { sprintId: string | null; status: WorkItemStatus; position: number }): WorkItem {
    const item = this.mustItem(workItemId);

    if (item.status === 'DONE') {
      throw new Error('DONE items are read-only');
    }

    if (next.sprintId) {
      const sprint = this.mustSprint(next.sprintId);
      if (sprint.status !== 'ACTIVE') {
        throw new Error('Sprint must be ACTIVE to move items');
      }
      if (!item.sprintId && next.status !== 'BACKLOG') {
        // backlog item pulled into active sprint is allowed
      }
    }

    const oldStatus = item.status;
    item.sprintId = next.sprintId;
    item.status = next.status;
    item.position = next.position;
    this.workItems.set(item.id, item);

    if (oldStatus !== next.status) {
      this.history.push({
        id: uuid(),
        workItemId: item.id,
        oldStatus,
        newStatus: next.status,
        changedAt: new Date().toISOString()
      });
    }

    return item;
  }

  listWorkItems(projectId: string): WorkItem[] {
    return [...this.workItems.values()].filter((w) => w.projectId === projectId);
  }

  listHistory(workItemId: string): WorkItemHistory[] {
    return this.history.filter((h) => h.workItemId === workItemId);
  }

  private nextPosition(projectId: string, sprintId: string | null, status: WorkItemStatus): number {
    const items = [...this.workItems.values()].filter(
      (w) => w.projectId === projectId && w.sprintId === sprintId && w.status === status
    );
    return items.length;
  }

  private mustItem(id: string): WorkItem {
    const item = this.workItems.get(id);
    if (!item) throw new Error('Work item not found');
    return item;
  }

  private mustSprint(id: string): Sprint {
    const sprint = this.sprints.get(id);
    if (!sprint) throw new Error('Sprint not found');
    return sprint;
  }
}
