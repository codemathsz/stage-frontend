import { API } from "@/lib/axios"
import { ProjectPhase } from "@/types"

export const createPhase = async (phase: ProjectPhase): Promise<ProjectPhase> => {
  const response = await API.post('/api/project/version/phase', phase)
  return response.data
}