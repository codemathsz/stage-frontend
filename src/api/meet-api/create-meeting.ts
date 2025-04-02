import { API } from "@/lib/axios";
import { MeetType } from "@/types";

export interface NewMeetProps {
  title: string;
  meetObjectiveId: string;
  meetDate: string;
  meetTimeStart: string;
  meetTimeFinish: string;
  moderator: string;
  participants: string[];
  agendas: {
    name: string;
    agendaTypeId: string;
  }[];
  projectPhaseId: string;
}

export async function createMeeting(meet: NewMeetProps) {
  await API.post<MeetType>("api/meet/create", meet);
}
