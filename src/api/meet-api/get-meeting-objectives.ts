import { API } from "@/lib/axios";

export async function getMeetingsObjectives() {

    const response = await API.get("/api/meeting-objective")

    return response.data;

}