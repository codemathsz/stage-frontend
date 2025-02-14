import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Header } from "@/components/header";
import { CalendarWidget } from "@/components/calendar-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
import { useEffect } from "react";
import Cookies from "js-cookie";
import LoadingSpinner from "@/components/spinner";
import { useGetUser } from "@/hooks/useGetUser";

export default function Home() {

  const navigate = useNavigate();
  const getUser = useGetUser();
  const user = useSelector((state: RootState) => state.user.userData) as User;

  const navigateToProject = () => {
    navigate("/project");
  };

  const navigateToProjectById = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  console.log(user.projects)

  useEffect(() => {
    const handleUpdateUserData = async () => {
      const token = Cookies.get("token");
      await getUser(token!);
    };
    handleUpdateUserData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">
                  Total Projects:  {user.projects.length} 
                </p>
                <Button
                  onClick={navigateToProject}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Project
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Code</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.projects.map((project) => {
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div>
            <CalendarWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
