import { API } from "@/lib/axios";
import { Project } from "@/types";

export async function createProject(project: Project) {
  const response = await API.post<Project>("/api/project/", project);
  return response.data;
};

export async function updateProjectApi(project: Project) {
  const response = await API.put(`/api/project/${project.id}`, project)
  return response.data
}

export async function getProjectById(id: string) {
  const response = await API.get<Project>(`/api/project/id/${id}`);
  return response.data;
};

export const getProjectByUserId = async (userId: string) => {
  const response = await API.get<Project>(`/api/project/userId/${userId}`);
  return response.data;
};
