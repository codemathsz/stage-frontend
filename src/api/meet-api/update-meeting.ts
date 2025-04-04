import { API } from "@/lib/axios";
import { MeetType } from "@/types";

export interface UpdateMeetProps {
  title: string;
  meetObjectiveId: string;
  meetDate: string;
  meetTimeStart: string;
  meetTimeFinish: string;
  moderator: string;
  participants: string[];
  agendas: {
    id:string
    name: string;
    agendaTypeId: string;
  }[];
  projectPhaseId: string;
}

export async function updateMeeting(meet: UpdateMeetProps) {
  await API.post<MeetType>("api/meet", meet);
}
