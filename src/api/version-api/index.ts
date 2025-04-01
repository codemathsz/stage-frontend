import { API } from "@/lib/axios";
import { ProjectVersion } from "@/types";

export const createVersion = async (version: ProjectVersion): Promise<ProjectVersion> => {
  const response = await API.post('/api/project/version', version)
  return response.data
}