import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { Project, User } from "@/types";
import { API } from "@/lib/axios";
import { useProject } from "@/context/ProjectContext";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface AlertDialogProps {
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project;
}

const AlertDialogDelete = ({ setOpenDropdown, project }: AlertDialogProps) => {

  const { getProjects } = useProject()
  const user = useSelector((state: RootState) => state.user.userData) as User;

  async function handleDelete() {
    await API.delete(`/api/project/${project.id}`);
    await getProjects(user.id)
  }

  const latestVersion = project.versions.reduce((latest, current) => {
    return parseFloat(current.version) > parseFloat(latest.version)
      ? current
      : latest;
  }, project.versions[0]);

  return (
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
      <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
        <AlertDialog.Title className="text-lg font-bold">
          Confirmar Exclusão
        </AlertDialog.Title>
        <AlertDialog.Description className="text-gray-600">
          Tem certeza que deseja deletar o{" "}
          <strong>{latestVersion?.title}</strong>?
        </AlertDialog.Description>
        <div className="flex justify-end gap-2 mt-4">
          <AlertDialog.Cancel asChild>
            <Button variant="outline">Cancelar</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action
            asChild
            onClick={() => {
              setTimeout(() => setOpenDropdown(false), 100);
            }}
          >
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="bg-red-500 text-white"
            >
              Deletar
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  );
};

interface DropdownWithModalProps {
  project: Project;
}

export function DropdownWithModal({ project }: DropdownWithModalProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <DropdownMenu.Root open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost">
          <MoreVertical size={20} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-300 p-2 z-50"
        align="end"
      >
        <DropdownMenu.Item className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200">
          <Pencil size={18} />
          Editar
        </DropdownMenu.Item>

        <DropdownMenu.Item
          className="flex items-center gap-2 p-2 cursor-pointer text-red-500 hover:bg-gray-200"
          onClick={() => {
            setOpenDialog(true);
            setOpenDropdown(false);
          }}
        >
          <Trash size={18} />
          Deletar
        </DropdownMenu.Item>
      </DropdownMenu.Content>

      <AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogDelete
          setOpenDropdown={setOpenDropdown}
          project={project}
        />
      </AlertDialog.Root>
    </DropdownMenu.Root>
  );
}
