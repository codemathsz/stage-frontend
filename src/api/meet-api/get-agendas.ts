import { API } from "@/lib/axios";

export async function getAgendas() {

    const response = await API.get("/api/agenda-type/all")

    return response.data;

}