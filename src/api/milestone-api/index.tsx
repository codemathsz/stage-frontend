import { API } from "@/lib/axios";
import { Milestone } from "@/types"


export const createMilestone = async (milestone: Milestone): Promise<Milestone> => {
  const response = await API.post('/api/milestone', milestone)
  return response.data
}