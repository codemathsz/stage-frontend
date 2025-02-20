import Cookies from "js-cookie";
import { API } from "./../lib/axios";
import { useQuery } from "@tanstack/react-query";

export const getProjectByUserId = async (userId: string) => {
  const token = Cookies.get("token");

  const response = await API.get(`/api/project/userId/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export function useGetProjectByUserId(id: string) {
  const query = useQuery({
    queryKey: ["fetchAllProjectsByUserId", id],
    queryFn: () => getProjectByUserId(id),
  });

  return {
    ...query,
    data: query.data,
  };
}
