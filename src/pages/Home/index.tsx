import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarWidget } from "@/components/calendar-widget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
import { useEffect } from "react";
import Cookies from "js-cookie";
import LoadingSpinner from "@/components/spinner";
import { useGetUser } from "@/hooks/useGetUser";
import { CarouselComponent } from "@/components/carousel-component";

export default function Home() {
  const navigate = useNavigate();
  const getUser = useGetUser();
  const user = useSelector((state: RootState) => state.user.userData) as User;

  const navigateToProjectById = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  useEffect(() => {
    const handleUpdateUserData = async () => {
      const token = Cookies.get("token");
      await getUser(token!);
    };
    handleUpdateUserData();
  }, []);

  return (
    <div className=" bg-background">
     
      <main className="w-11/12 mx-auto max-w-[90rem] flex flex-col gap-16">
        <div className="w-full h-auto max-h-[36rem] mb-8">
          <CarouselComponent/>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Últimos 5 Projetos</CardTitle>
              <CardDescription>Acompanhe os projetos mais recentes em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código do Projeto</TableHead>
                    <TableHead>Nome do Projeto</TableHead>
                    <TableHead>Data de Inicio</TableHead>
                    <TableHead>Nº de fases</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user?.projects?.map((project) => {
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
                        title="acessar projeto"
                        onClick={() => navigateToProjectById(project.id)}
                      >
                        <TableCell>{project?.cod}</TableCell>
                        <TableCell>{latestVersion?.title}</TableCell>
                        <TableCell>
                          {latestVersion?.startDate &&
                            formatDate(latestVersion?.startDate?.toString())}
                        </TableCell>
                        <TableCell className="w-1/2 flex items-center justify-center">
                          {latestVersion?.phases.length}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </div>
          <div>
            <CalendarWidget />
          </div>
          </main>
        </div>
  );
}
