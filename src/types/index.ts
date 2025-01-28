export interface Role {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
}

export interface Project {
  id: string;
  cod: string;
  userId: string;
  createdAt: Date;
  versions: ProjectVersion[];
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  version: string;
  title: string;
  address: string;
  district: string;
  city: string;
  state: string;
  updatedAt: Date;
  startDate: Date;
  constructionStartDate: Date;
  phases: ProjectPhase[];
}

export interface ProjectPhase {
  id: string;
  projectVersionId: string;
  name: string;
  weeks: number;
  isIndependent: boolean;
  startDate: Date;
  independentDate: Date;
  phaseOrder: number;
  phaseType: PhaseType;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  projectPhaseId: string;
  name: string;
  date: Date;
}

export enum PhaseType {
  PROJECT = 'PROJECT',
  CONSTRUCTION = 'CONSTRUCTION',
  // Adicione outros tipos conforme necessário
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthDate: Date;
  document: string;
  role: Role;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
  projects: Project[];
}