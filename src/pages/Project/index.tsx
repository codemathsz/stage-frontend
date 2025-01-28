import { useState, useCallback, useEffect } from "react"
import { ProjectHeader } from "@/components/project-header"
import { TimelineSection } from "@/components/timeline-section"
import { type Project, type ProjectVersion, type ProjectPhase, PhaseType, User } from "@/types/index"
import { Button } from "@/components/ui/button"
import { Save, Plus } from "lucide-react"
import { mockProject } from "@/lib/utils"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { GanttChart } from "@/components/gantt-chart"
import { ExportButtons } from "@/components/export-buttons"
import { createProject, getProjectById, getProjectByUserId } from "@/api/project-api"
import { createVersion } from "@/api/version-api"
import { createPhase } from "@/api/phase-api"
import isEqual from 'lodash/isEqual';
import { ChevronLeft } from "lucide-react"
import LoadingSpinner from "@/components/spinner"

interface IVersion{
  id: string
  version: string
}

const Project = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [versions, setVersions] = useState<IVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<IVersion | null>(null);
  const [project, setProject] = useState<Project>()
  const [initialProject, setInitialProject] = useState<Project>(); 
  const [currentVersion, setCurrentVersion] = useState<ProjectVersion | null>(null)
  const user = useSelector((state: RootState) => state.user.userData) as User;

  const findLatestVersion = (versions: ProjectVersion[]): ProjectVersion | null => {
    if (versions.length === 0) return null;
    return versions.reduce((latest, current) => {
      return parseFloat(current.version) > parseFloat(latest.version) ? current : latest;
    });
  };
   
  const handleProjectById = async (id: string) =>{
    const response = await getProjectById(id);
    return response
  }

  useEffect( () => {
    const getProject = async () =>{
      if(id){
        const response = await handleProjectById(id)
        setProject(response)
        setInitialProject(response)
        const latestVersion = findLatestVersion(response.versions)
        setCurrentVersion(latestVersion)
        setSelectedVersion(latestVersion)
        setVersions(handleSetVersion(response.versions))
      }else{
        const latestVersion = findLatestVersion(mockProject.versions)
        if(user?.id){
          mockProject.userId = user.id
        }
        setProject(mockProject)
        setInitialProject(mockProject)
        setCurrentVersion(latestVersion)
        setSelectedVersion(latestVersion)
        setVersions(handleSetVersion(mockProject.versions));
      }
    }

    getProject()
  }, [id, user])

  const handleSetVersion =(versions: ProjectVersion[])=>{
    return versions.map((version) => {
      const convertVersion = Number(version.version)
      return {
        id: version.id!,
        version: convertVersion.toFixed(1),
      };
    })
  }

  const handleChangeSelectVersion = (versionId: string) =>{
    const current = project?.versions.find((v) => v.id === versionId)
    if (current) {
      setCurrentVersion(current)
      setSelectedVersion(current)
    }
  }
  const handleUpdate = useCallback(
    (updatedVersion: Partial<ProjectVersion>) => {
      if (project && currentVersion) {
        const newVersion: ProjectVersion = {
          ...currentVersion,
          ...updatedVersion,
          updatedAt: new Date(),
        }
        setCurrentVersion(newVersion)
        setProject((prevProject:any) => ({
          ...prevProject!,
          versions: [newVersion, ...prevProject!.versions.slice(1)],
        }))
      }
    },
    [project, currentVersion],
  )

  const handleProject= useCallback(
    (updatedProject: Partial<Project>) => {
      if (project) {
        const newProject: Project = {
          ...project,
          ...updatedProject,
        }
        setProject(newProject)
      }
    },
    [project],
  )

  const addNewPhase = useCallback(
    (phaseType: PhaseType) => {
      if (currentVersion) {
        const newPhase: ProjectPhase = {
          id: Date.now().toString(),
          projectVersionId: currentVersion?.id ?? '',
          name: "Nova Fase",
          weeks: 2,
          isIndependent: false,
          startDate: new Date(),
          independentDate: new Date(),
          phaseOrder: currentVersion.phases.length + 1,
          phaseType: phaseType,
          milestones: [],
        }

        handleUpdate({
          phases: [...currentVersion.phases, newPhase],
        })
      }
    },
    [currentVersion, handleUpdate],
  )

  const deletePhase = useCallback(
    (id: string) => {
      if (currentVersion) {
        handleUpdate({
          phases: currentVersion.phases.filter((phase:ProjectPhase) => phase.id !== id),
        })
      }
    },
    [currentVersion, handleUpdate],
  )

  const saveConfigurations = async() => {
    if(!project) return
    let projectId = project.id;
    if(!project.id && !id){
      const responseCreateProject = await createProject(project)
      projectId = responseCreateProject.id
    }
    
    if(currentVersion){
      const versionData = {...currentVersion, projectId: projectId,version: (Number.parseFloat(currentVersion.version) + 0.1).toFixed(1) }
      const responseCreateVersion = await createVersion(versionData)
      if(currentVersion.phases){
        for(const phase of currentVersion.phases){
          const currentPhase: ProjectPhase = {...phase, projectVersionId: responseCreateVersion.id}
          await createPhase(currentPhase)
        }
      }
    }
    const updatedProject = await getProjectByUserId(user.id)
    setProject(updatedProject.data)
    navigate(`/project/${projectId}`);
  }

  const handleGoToHome = () =>{
    navigate('/home')
  }

  if (!project || !currentVersion) {
    return <LoadingSpinner />
  }
  const hasChanges = !isEqual(project, initialProject);
  
  const projectPhases = currentVersion?.phases?.filter((phase:ProjectPhase) => phase.phaseType === PhaseType.PROJECT)
  const constructionPhases = currentVersion?.phases?.filter((phase:ProjectPhase) => phase.phaseType === PhaseType.CONSTRUCTION)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          
          <span className="flex items-center gap-2">
            <button onClick={handleGoToHome}><ChevronLeft className="h-5 w-5 font-bold"/></button>
            <h1 className="text-2xl font-bold">
              Cronograma do Projeto
            </h1>
          </span>
          <div className="flex gap-2">
            <Button onClick={saveConfigurations} className="flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed" disabled={!hasChanges}>
              <Save size={20} />
              Salvar Configurações
            </Button>
            <select
              className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
              value={selectedVersion?.id || ''}
              onChange={(e) => handleChangeSelectVersion(e.target.value)}
            >
              <option value="" disabled>
                Selecione uma versão
              </option>
              {versions.map((version, _index) => (
                <option key={_index} value={version.id}>
                  Versão {version.version}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ProjectHeader project={project} projectData={currentVersion} onUpdate={handleUpdate} onUpdateProject={handleProject} />

        <div className="mt-12 mb-8 border-b pb-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Fases de Projeto</h2>
              <p className="text-sm text-gray-600">
                Total: {projectPhases?.reduce((sum: any, phase: ProjectPhase) => sum + phase.weeks, 0) ?? 0} semanas
              </p>
            </div>
          </div>
          <Button onClick={() => addNewPhase(PhaseType.PROJECT)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Fase
          </Button>
        </div>

        <TimelineSection
          title="Fases de Projeto"
          phases={projectPhases}
          onUpdate={(updatedPhases:any) => handleUpdate({ phases: [...updatedPhases, ...constructionPhases ?? []] })}
          onDeletePhase={deletePhase}
        />

        <div className="mt-12 mb-8 border-b pb-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Fases de Obra</h2>
              <p className="text-sm text-gray-600">
                Total: {constructionPhases?.reduce((sum:any, phase:ProjectPhase) => sum + phase.weeks, 0)} semanas
              </p>
            </div>
          </div>
          <Button onClick={() => addNewPhase(PhaseType.CONSTRUCTION)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Fase
          </Button>
        </div>

        <TimelineSection
          title="Fases de Obra"
          phases={constructionPhases}
          onUpdate={(updatedPhases:any) => handleUpdate({ phases: [...projectPhases ?? [], ...updatedPhases] })}
          onDeletePhase={deletePhase}
        />
        {
          currentVersion && (
          <div className="mt-8 pt-4 border-t-2 mb-8">
            <GanttChart projectVersion={currentVersion!} />
          </div>
          )
        }
      </div>

      <ExportButtons projectVersion={currentVersion!} />
    </div>
  )
}

export default Project