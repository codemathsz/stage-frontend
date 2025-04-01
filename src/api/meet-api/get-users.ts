import { API } from "@/lib/axios";
import { User } from "@/types";

export async function getUsers() {

    const response = await API.get<User[]>("/users/")

    return response.data;

}