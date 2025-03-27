import { getProjectById } from "@/api/project-api";
import { PhaseMeetingComponent } from "@/components/phase-meeting-component";
import LoadingSpinner from "@/components/spinner";
import { Project, ProjectVersion } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export type MeetType = {
  cod: string
  status: string
  meetingDate: string
  title: string
  objective: string
}

export function Meet(){
  const { id } = useParams();
  const [project, setProject] = useState<Project>()
  const [latestVersion, setLatestVersion] = useState<ProjectVersion | null>()
  const [addresAlias, setAddresAlias] = useState<string>()
  const mockMeeting: MeetType[] = [
    {
      cod: 'LV01',
      status: 'Pendente',
      meetingDate: '18/02/2025, 10:00',
      title: 'Reunião levantamento',
      objective: 'Estratégia'
    },
  ]
  const getlatestVersionProject = (versions: ProjectVersion[]): ProjectVersion | null => {
    if (versions.length === 0) return null;
    return versions.reduce((latest, current) => {
      return parseFloat(current.version) > parseFloat(latest.version)
        ? current
        : latest;
    });
  };

  useEffect(() => {
    if(!id) return
    (async () => {
      try {
        const response = await getProjectById(id);
        setProject(response);
      } catch (error) {
        console.error('Erro ao obter projeto:', error);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (project) {
      const latest = getlatestVersionProject(project.versions);
      setLatestVersion(latest);
    }
  }, [project]);
  
  useEffect(() => {
    if (latestVersion) {
      setAddresAlias(`${latestVersion.address}, ${latestVersion.district}, ${latestVersion.city} - ${latestVersion.cep}`);
    }
  }, [latestVersion]);

  return (
    <div className="w-full max-h-screen mx-auto px-6 mt-8 overflow-scroll">
      {
        !project ? (
          <div>
            <LoadingSpinner/>
          </div>
        ): (
          <div className="w-full bg-white rounded-lg py-4 px-8 flex flex-col gap-16 mb-40 shadow-sm">
            {/* header */}
            <div className="w-full font-poppins flex flex-col gap-3">
              <div className="flex gap-2  text-lg font-bold">
                <span>{latestVersion?.title}</span>
                <span>-</span>
                <span>{addresAlias}</span>
              </div>
              <div>
                <span className="text-base">Código: {project.cod}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <p className="font-poppin text-xl font-medium">Etapas</p>
              <div className="w-full flex flex-col gap-4">
                {
                  latestVersion?.phases.map((phase, _index) =>{
                    return (
                      <PhaseMeetingComponent key={_index} projectPhase={phase} meeting={_index === 0 ? mockMeeting : []}/>
                    )
                  })
                }
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}