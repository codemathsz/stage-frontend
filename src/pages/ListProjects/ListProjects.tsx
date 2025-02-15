import LoadingSpinner from "@/components/spinner";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUser } from "@/hooks/useGetUser";
import { formatDate } from "@/lib/utils";
import { RootState } from "@/store/store";
import { User } from "@/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  MagnifyingGlass,
  Plus,
  DotsThree,
  CaretDown,
  Trash,
  Pencil,
  Clipboard,
} from "phosphor-react";
import { Button } from "@/components/ui/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
export function ListProjects() {
  const getUser = useGetUser();
  const [filter, setFilter] = useState("");
  const user = useSelector((state: RootState) => state.user.userData) as User;

  useEffect(() => {
    const handleUpdateUserData = async () => {
      const token = Cookies.get("token");
      if (token) await getUser(token);
    };
    handleUpdateUserData();
  }, [getUser]);

  if (!user) {
    return <LoadingSpinner />;
  }

  const filteredProjects = user.projects
    .map((project) => ({
      ...project,
      latestVersion: project.versions.reduce(
        (latest, current) =>
          parseFloat(current.version) > parseFloat(latest.version)
            ? current
            : latest,
        project.versions[0]
      ),
    }))
    .filter(({ cod, latestVersion }) =>
      [latestVersion?.title, cod].some((text) =>
        text?.toLowerCase().includes(filter.toLowerCase())
      )
    );

  return (
    <div className="bg-[#F9F9F9]">
      <div className="flex justify-between items-center px-6 mt-8 h-20 border rounded-lg border-gray-200">
        <div className="relative w-full max-w-xl">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <Input
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Digite o nome ou código do projeto"
            className="pl-10 w-full focus:border-none placeholder:font-bold"
          />
        </div>
        <Button>
          <Plus className="text-white" size={20} />
          Criar novo projeto
        </Button>
      </div>

      <div className="w-full border border-gray-200 rounded-md p-10 mt-10">
        <h1 className="flex gap-2 text-xl font-bold">
          Total:<p className="text-gray-400">{user.projects.length}</p>
        </h1>

        <Table className="mt-10">
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="font-bold">Nome</TableHead>
              <TableHead className="font-bold">Endereço</TableHead>
              <TableHead className="font-bold">Data de início</TableHead>
              <TableHead className="font-bold">N° de fases</TableHead>
              <TableHead className="flex font-bold items-center gap-1">
                Opções <CaretDown size={14} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(filteredProjects.length > 0
              ? filteredProjects
              : user.projects
            ).map((project) => {
              const latestVersion = project.versions.reduce(
                (latest, current) => {
                  return parseFloat(current.version) >
                    parseFloat(latest.version)
                    ? current
                    : latest;
                },
                project.versions[0]
              );
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <img
                        className="w-12 rounded-full"
                        src="https://www.diretoriodaarquitetura.com.br/wp-content/uploads/2022/09/estiloNEOCLASSICO2.jpg"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold">
                          {latestVersion.title}
                        </p>
                        <p>{project.cod}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{latestVersion?.address}</TableCell>
                  <TableCell>
                    {latestVersion?.startDate &&
                      formatDate(latestVersion?.startDate.toString())}
                  </TableCell>
                  <TableCell>{latestVersion.phases.length}</TableCell>
                  <TableCell className="cursor-pointer">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <DotsThree size={20} />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="flex flex-col gap-1.5 bg-black text-white rounded-md p-4 w-40">
                        <DropdownMenu.Item className="flex justify-between gap-3">
                          Ver fases
                          <Clipboard className="text-gray-00" size={20} />
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="flex justify-between gap-3">
                          Editar <Pencil size={20} />
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item className="flex justify-between gap-3">
                          Deletar <Trash className="text-red-500" size={20} />
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
