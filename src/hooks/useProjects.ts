import { API } from "../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProjectByUserId } from "@/api/project-api";

async function deleteProject(projectId: string) {
  if (projectId) {
    await API.delete(`/api/project/${projectId}`);
  }
}

export function useProject(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["fetchAllProjectsByUserId", id],
    queryFn: () => getProjectByUserId(id),
  });

  const { mutate: handleDeleteProject } = useMutation({
    mutationFn: async (id: string) => await deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllProjectsByUserId"] });
      toast.success("Projeto deletado com sucesso");
    },
  });

  return {
    ...query,
    projects: query.data,
    handleDeleteProject: handleDeleteProject,
  };
}
