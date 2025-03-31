import { API } from "@/lib/axios";

export async function getParticipants() {

    const response = await API.get("/users")

    return response.data;

}