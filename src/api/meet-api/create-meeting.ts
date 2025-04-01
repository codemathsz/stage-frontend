import { API } from "@/lib/axios";
import { MeetType } from "@/types";


export async function createMeeting(meet: MeetType) {
    await API.post<MeetType>("api/meet/create", meet)
}