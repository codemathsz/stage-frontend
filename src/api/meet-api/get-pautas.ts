import { API } from "@/lib/axios";

export async function getPautas() {

    const response = await API.get("/api/agenda-type/all")

    return response.data;

}