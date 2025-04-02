import { API } from "@/lib/axios";
import { MeetType } from "@/types";

export async function getPhase(id: string) {
  const response = await API.get<MeetType[]>(`/api/meet/project-phase/${id}`);
  return response.data;
}
