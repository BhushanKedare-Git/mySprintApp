export type Role = 'ADMIN' | 'MEMBER' | 'VIEWER';
export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';
export type WorkItemType = 'STORY' | 'TASK' | 'BUG';
export type WorkItemStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  key: string;
  startDate?: string;
  endDate?: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  status: SprintStatus;
}

export interface WorkItem {
  id: string;
  projectId: string;
  sprintId: string | null;
  epicId: string | null;
  type: WorkItemType;
  title: string;
  description?: string;
  status: WorkItemStatus;
  priority: number;
  storyPoints: number;
  assigneeId?: string;
  position: number;
}

export interface WorkItemHistory {
  id: string;
  workItemId: string;
  oldStatus: WorkItemStatus;
  newStatus: WorkItemStatus;
  changedAt: string;
}
