import { API } from "@/lib/axios";
import { Milestone } from "@/types"
import Cookies from "js-cookie";

export const createMilestone = async (milestone: Milestone): Promise<Milestone> =>{
  const token = Cookies.get('token');

  const response = await API.post('/api/milestone', milestone, {
    headers: { 
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}` 
    } 
  })
  return response.data
}