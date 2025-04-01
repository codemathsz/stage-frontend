import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Calendar } from "lucide-react";
import { Project } from "@/types";
import { DotsThree } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectById } from "@/api/project-api";
import { AlertDialogAction, AlertDialogCancel, AlertDialogPortal, AlertDialogOverlay, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialog } from "../ui/alert-dialog";
import { DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenu } from "../ui/dropdown-menu"
import { toast } from "sonner"
interface AlertDialogProps {
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project;
}

const AlertDialogDelete = ({ setOpenDropdown, project }: AlertDialogProps) => {

  const queryClient = useQueryClient();

  const latestVersion = project.versions.reduce((latest, current) => {
    return parseFloat(current.version) > parseFloat(latest.version)
      ? current
      : latest;
  }, project.versions[0]);

  const { mutateAsync: deleteProjectByIdFn, isPending } = useMutation({
    mutationFn: (id: string) => deleteProjectById(id),
  })


  async function handleDeleteProjectById(projectId: string) {
    try {
      await deleteProjectByIdFn(projectId)
      queryClient.invalidateQueries({ queryKey: ["get-projects"] })
      toast.success("Projeto deletado com sucesso.")
    } catch {
      toast.error("Houve um erro ao tentar deletar, tente novamente.")
    }

  }

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay className="fixed inset-0 bg-black/50" />
      <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
        <AlertDialogTitle className="text-lg font-bold">
          Confirmar Exclusão
        </AlertDialogTitle>
        <AlertDialogDescription className="text-gray-600">
          Tem certeza que deseja deletar o{" "}
          <strong>{latestVersion?.title}</strong>?
        </AlertDialogDescription>
        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel asChild>
            <Button variant="ghost" className="border border-black">Cancelar</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            onClick={() => {
              setTimeout(() => setOpenDropdown(false), 100);
            }}
          >
            <Button
              disabled={isPending}
              onClick={() => handleDeleteProjectById(project.id)}
              variant="destructive"
              className="bg-red-500 text-white"
            >
              Deletar
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  );
};

interface DropdownWithModalProps {
  project: Project;
}

export function DropdownWithModal({ project }: DropdownWithModalProps) {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  function handleGoToEditProject(id: string) {
    if (!id) return
    navigate(`/project/${id}`);
  }

  const handleMeetPhasesProject = () => {
    if (!project.id) return
    return navigate(`/meeting/${project.id}`)
  }

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <DotsThree size={24} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-300 p-2 z-50"
        align="end"
      >
        <DropdownMenuItem onClick={() => handleGoToEditProject(project.id)} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200">
          <Pencil size={18} />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => handleMeetPhasesProject()}
        >
          <Calendar size={18} />
          Meet
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 p-2 cursor-pointer text-red-500 hover:bg-gray-200"
          onClick={() => {
            setOpenDialog(true);
            setOpenDropdown(false);
          }}
        >
          <Trash size={18} />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogDelete
          setOpenDropdown={setOpenDropdown}
          project={project}
        />
      </AlertDialog>
    </DropdownMenu>
  );
}
