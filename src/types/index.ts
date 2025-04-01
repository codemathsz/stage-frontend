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
  cep: string;
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
  startDate: string;
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
  PROJECT = "PROJECT",
  CONSTRUCTION = "CONSTRUCTION",
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

export interface MeetType {
  title: string;
  meetObjectiveId: number;
  meetDate: string;
  meetTimeStart: string;
  meetTimeFinish: string;
  moderator: string;
  participants: string[];
  agendas: [
    {
      name: string;
      agendaTypeId: number;
    }
  ];
  projectPhaseId: string;
}

export interface AgendaType {
  id: string;
  name: string;
  created_at: string;
  activated: boolean;
}


