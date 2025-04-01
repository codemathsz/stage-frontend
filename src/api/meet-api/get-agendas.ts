import { API } from "@/lib/axios";
import { AgendaType } from "@/types";

export async function getAgendas() {

    const response = await API.get<AgendaType[]>("/api/agenda-type/all")

    return response.data;

}