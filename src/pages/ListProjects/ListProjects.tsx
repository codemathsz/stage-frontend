import { Header } from "@/components/header";
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
    latestVersion: project.versions.reduce((latest, current) =>
      parseFloat(current.version) > parseFloat(latest.version) ? current : latest,
      project.versions[0]
    ),
  }))
  .filter(({ cod, latestVersion }) =>
    [latestVersion?.title, cod]
      .some((text) => text?.toLowerCase().includes(filter.toLowerCase()))
  );


  return (
    <>
      <Header />
      <div className="w-full m-10">
        <div className="w-[40%] border border-gray-200 rounded-md p-10">
          <h1 className="font-bold text-4xl">Lista de projetos</h1>

          <Input
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Busque por um projeto"
            className="mt-5 focus:border-none"
          />

          <Table className="mt-10">
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Data de início</TableHead>
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
                  <TableRow
                    key={project.id}
                    className="cursor-pointer"
                    title="Acessar projeto"
                    onClick={() => alert("Mostrar fases") } 
                  >
                    <TableCell>{project.cod}</TableCell>
                    <TableCell>{latestVersion?.title}</TableCell>
                    <TableCell>
                      {latestVersion?.startDate &&
                        formatDate(latestVersion?.startDate.toString())}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
