import { PhaseType, Project, User } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge"
import { API } from "./axios";
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getSession(token: string):Promise<User | null> { 
  if (!token) { 
    return null; 
  } 
  const decodedToken =  jwtDecode(token)
  const user = await API.get(`/users/${decodedToken.sub}`, {
    headers: { 
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}` 
    } 
  })
  return user.data
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

export const formatDateISO = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const isoString = date.toISOString();
  return isoString.split('T')[0];
};

export const mockProject: Project = {
  id: "",
  cod: "",
  userId: "",
  createdAt: new Date(),
  versions: [
    {
      id: uuidv4(),
      projectId: "",
      version: "1.0",
      title: "",
      address: "",
      district: "",
      city: "",
      state: "",
      updatedAt: new Date(),
      startDate: new Date(),
      constructionStartDate: new Date(),
      phases: [
        {
          id: "1",
          projectVersionId: '',
          name: "Levantamento",
          weeks: 2,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 1,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "2",
          projectVersionId: '',
          name: "Estudo de Viabilidade",
          weeks: 2,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 2,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "3",
          projectVersionId: '',
          name: "Orientação de Custo Preliminar",
          weeks: 2,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 3,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "4",
          projectVersionId: '',
          name: "Estudo Preliminar",
          weeks: 3,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 4,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "5",
          projectVersionId: '',
          name: "Anteprojeto",
          weeks: 3,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 5,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "6",
          projectVersionId: '',
          name: "Orçamento",
          weeks: 2,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 6,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "7",
          projectVersionId: '',
          name: "Projeto Executivo",
          weeks: 3,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 7,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "8",
          projectVersionId: '',
          name: "Concorrência",
          weeks: 2,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 8,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "9",
          projectVersionId: '',
          name: "Detalhamento",
          weeks: 2,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 9,
          phaseType: PhaseType.PROJECT,
          milestones: [],
        },
        {
          id: "10",
          projectVersionId: '',
          name: "Obra Cinza",
          weeks: 12,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 10,
          phaseType: PhaseType.CONSTRUCTION,
          milestones: [],
        },
        {
          id: "11",
          projectVersionId: '',
          name: "Acabamentos",
          weeks: 8,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 11,
          phaseType: PhaseType.CONSTRUCTION,
          milestones: [],
        },
        {
          id: "12",
          projectVersionId: '',
          name: "Marcenaria",
          weeks: 6,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 12,
          phaseType: PhaseType.CONSTRUCTION,
          milestones: [],
        },
        {
          id: "13",
          projectVersionId: '',
          name: "Finalização",
          weeks: 4,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: 13,
          phaseType: PhaseType.CONSTRUCTION,
          milestones: [],
        },
      ],
      cep: ""
    },
  ],
}