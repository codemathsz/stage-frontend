import { API } from "@/lib/axios"
import { getCookie } from "@/lib/utils"
import { ProjectPhase } from "@/types"

export const createPhase = async (phase: ProjectPhase): Promise<ProjectPhase> =>{
  const token = getCookie('auth-token')

  const response = await API.post('/api/project/version/phase', phase, {
    headers: { 
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}` 
    } 
  })
  return response.data
}