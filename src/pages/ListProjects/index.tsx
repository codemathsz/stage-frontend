import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { RootState } from "@/store/store";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus, CaretDown, X } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { DropdownWithModal } from "@/components/Modal/DropdownWithModal";
import { useProject } from "@/context/ProjectContext";
export function ListProjects() {
  const { projects, getProjects} = useProject()
  const [filter, setFilter] = useState("");
  const user = useSelector((state: RootState) => state.user.userData) as User;

  const filteredProjects = projects?.map((project) => ({
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

  useEffect(() =>{
    getProjects(user.id)
  },[user])

  return (
    <div className="bg-transparent">
      <div className="bg-white flex justify-between items-center px-6 mt-8 h-20 rounded-lg shadow-sm">
        <div className="relative w-full max-w-xl flex items-center gap-4">
          <Input
            onChange={(event) => setFilter(event.target.value)}
            value={filter}
            placeholder="Digite o nome ou código do projeto"
            className="bg-white px-4 py-6 border font-poppins font-medium border-secondary border-opacity-25 w-full focus:!outline-none focus:ring-0 focus:ring-transparent placeholder:font-medium placeholder:font-poppins"
          />
          {filter ? (
            <div
              className="w-12 h-12 p-2 flex items-center justify-center border rounded-lg border-secondary border-opacity-25 cursor-pointer"
              title="limpar"
              onClick={() => setFilter("")}
            >
              <X size={32} className="text-secondary" />
            </div>
          ) : (
            ""
          )}
        </div>
        <Button className="text-white">
          <Plus className="text-white" size={20} />
          Criar novo projeto
        </Button>
      </div>

      <div className="bg-white w-full border border-gray-200 rounded-md p-10 mt-10">
        <h1 className="flex gap-2 text-xl font-bold">
          Total:<p className="text-gray-400">{projects?.length}</p>
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
            {(filteredProjects && filteredProjects?.length > 0
              ? filteredProjects
              : projects ?? []
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
                          {latestVersion?.title}
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
                  <TableCell>{latestVersion?.phases?.length}</TableCell>
                  <TableCell className="cursor-pointer">
                    <DropdownWithModal project={project} />
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
