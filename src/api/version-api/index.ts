import { API } from "@/lib/axios";
import { ProjectVersion } from "@/types";
import Cookies from "js-cookie";

export const createVersion = async (version: ProjectVersion): Promise<ProjectVersion> =>{
  const token = Cookies.get('token');

  const response = await API.post('/api/project/version', version, {
    headers: { 
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}` 
    } 
  })
  return response.data
}