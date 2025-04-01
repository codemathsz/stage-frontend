import { API } from "@/lib/axios";
import { AgendaType } from "@/types";

export async function getMeetingsObjectives() {

    const response = await API.get<AgendaType[]>("/api/meeting-objective/all")

    return response.data;

}