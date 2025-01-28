import { API } from "@/lib/axios";
import { getCookie } from "@/lib/utils";
import { ProjectVersion } from "@/types";

export const createVersion = async (version: ProjectVersion): Promise<ProjectVersion> =>{
  const token = getCookie('auth-token')

  const response = await API.post('/api/project/version', version, {
    headers: { 
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}` 
    } 
  })
  return response.data
}