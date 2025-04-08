import { API } from "@/lib/axios";

export interface UpdateMeetProps {
  title: string;
  meetObjectiveId: string;
  meetDate: string;
  meetTimeStart: string;
  meetTimeFinish: string;
  moderator: string;
  participants: string[];
  agendas: {
    id: string;
    name: string;
    agendaTypeId: string;
  }[];
  projectPhaseId: string;
}

export interface UpdateMeetingParams {
  id: string;
  meet: UpdateMeetProps;
}

export async function updateMeetingApi({ meet, id }: UpdateMeetingParams) {
  await API.put<UpdateMeetProps>(`api/meet/${id}`, meet);
}
