import { API } from "@/lib/axios";
import { Project } from "@/types";
import Cookies from "js-cookie";

export const createProject = async (project: Project): Promise<Project> => {
  const token = Cookies.get("token");

  const response = await API.post("/api/project/", project, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProjectApi = async (project: Project): Promise<Project> =>{
  const token = Cookies.get('token');

  const response = await API.put(`/api/project/${project.id}`, project, {
    headers: { 
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}` 
    } 
  })
  return response.data
}

export const getProjectById = async (id: string): Promise<Project> => {
  const token = Cookies.get("token");

  const response = await API.get(`/api/project/id/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getProjectByUserId = async (userId: string) => {
  const token = Cookies.get("token");

  const response = await API.get(`/api/project/userId/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
