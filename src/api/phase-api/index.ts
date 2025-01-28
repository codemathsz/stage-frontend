import { API } from "@/lib/axios"
import { ProjectPhase } from "@/types"
import Cookies from "js-cookie";

export const createPhase = async (phase: ProjectPhase): Promise<ProjectPhase> =>{
  const token = Cookies.get('token');

  const response = await API.post('/api/project/version/phase', phase, {
    headers: { 
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}` 
    } 
  })
  return response.data
}