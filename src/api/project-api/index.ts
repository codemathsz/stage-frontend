import { API } from "@/lib/axios";
import { Project } from "@/types";

export const createProject = async (project: Project) => {
  const response = await API.post<Project>("/api/project/", project);
  return response.data;
};

export const updateProjectApi = async (project: Project) => {
  const response = await API.put<Project>(
    `/api/project/${project.id}`,
    project
  );
  return response.data;
};

export const getProjectById = async (id: string) => {
  const response = await API.get<Project>(`/api/project/id/${id}`);
  return response.data;
};

export const getProjectByUserId = async (userId: string) => {
  const response = await API.get<Project>(`/api/project/userId/${userId}`);
  return response.data;
};
