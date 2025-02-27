import { useState, useCallback, useEffect } from "react";
import { ProjectHeader } from "@/components/project-header";
import { TimelineSection } from "@/components/timeline-section";
import {
  type Project,
  type ProjectVersion,
  type ProjectPhase,
  PhaseType,
  User,
} from "@/types/index";
import { Button } from "@/components/ui/button";
import { Save, Plus } from "lucide-react";
import { mockProject } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GanttChart } from "@/components/gantt-chart";
import { ExportButtons } from "@/components/export-buttons";
import {
  createProject,
  getProjectById,
  updateProjectApi,
} from "@/api/project-api";
import { createVersion } from "@/api/version-api";
import { createPhase } from "@/api/phase-api";
import { ChevronLeft } from "lucide-react";
import LoadingSpinner from "@/components/spinner";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { createMilestone } from "@/api/milestone-api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
interface IVersion {
  id: string;
  version: string;
}

const newProject = z.object({
  title: z.string().min(1, "Informe o nome do projeto"),
  cep: z.string().min(8, "Informe o CEP"),
  street: z.string().min(1, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  address: z.string().min(1, "Informe o endereço"),
  district: z.string().min(1, "Informe o bairro"),
  city: z.string().min(1, "Informe a cidade"),
  state: z.string().min(1, "Informe a UF"),
  cod: z.string().min(4, "Informe o codigo"),
  startDate: z.date(),
});

type NewProjectFormType = z.infer<typeof newProject>;

export function Project() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [versions, setVersions] = useState<IVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<IVersion | null>(null);
  const [project, setProject] = useState<Project>();
  const [initialProject, setInitialProject] = useState<Project>();
  const user = useSelector((state: RootState) => state.user.userData) as User;
  const [currentVersion, setCurrentVersion] = useState<ProjectVersion | null>(
    null
  );
  const [constructionStartDate, setConstructionStartDate] = useState<string>();

  const { register, handleSubmit, setValue, watch, formState } =
    useForm<NewProjectFormType>({
      defaultValues: {
        title: currentVersion?.title,
      },
      resolver: zodResolver(newProject),
      mode: "onSubmit",
    });

  const findLatestVersion = (
    versions: ProjectVersion[]
  ): ProjectVersion | null => {
    if (versions.length === 0) return null;
    return versions.reduce((latest, current) => {
      return parseFloat(current.version) > parseFloat(latest.version)
        ? current
        : latest;
    });
  };

  const { isSubmitting, errors } = formState;
  console.log(isSubmitting);

  const handleProjectById = async (id: string) => {
    const response = await getProjectById(id);
    return response;
  };

  useEffect(() => {
    const getProject = async () => {
      if (id) {
        const response = await handleProjectById(id);
        handleUpdatedData(response);
      } else {
        if (user?.id) {
          mockProject.userId = user.id;
        }
        handleUpdatedData(mockProject);
      }
    };
    getProject();
  }, [id, user]);

  const cep = watch("cep");

  useEffect(() => {
    if (cep?.length >= 8) {
      axios
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          const data = response.data;
          if (!data.erro) {
            setValue("address", data.logradouro || "");
            setValue("district", data.bairro || "");
            setValue("city", data.localidade || "");
            setValue("state", data.uf || "");
          } else {
            alert("CEP não encontrado.");
          }
        })
        .catch((error) => {
          console.error("Erro ao fazer a requisição:", error.message);
        });
    } else {
      setValue("address", "");
      setValue("district", "");
      setValue("city", "");
      setValue("state", "");
    }
  }, [cep, setValue]);

  const handleUpdatedData = (project: Project) => {
    setProject(project);
    setInitialProject(project);
    const latestVersion = findLatestVersion(project?.versions);
    if (latestVersion) {
      setValue("title", latestVersion?.title);
      setValue("cep", latestVersion?.cep);
      setValue("address", latestVersion?.address);
      setValue("city", latestVersion?.city);
      setValue("state", latestVersion?.state);
      setValue("cod", project.cod);
      setValue("startDate", latestVersion.startDate);
    }
    setCurrentVersion(latestVersion);
    setSelectedVersion(latestVersion);
    setVersions(handleSetVersion(project.versions));
  };

  const handleSetVersion = (versions: ProjectVersion[]) => {
    return versions.map((version) => {
      const convertVersion = Number(version.version);
      return {
        id: version.id!,
        version: convertVersion.toFixed(1),
      };
    });
  };

  const handleChangeSelectVersion = (versionId: string) => {
    const current = project?.versions.find((v) => v.id === versionId);
    if (current) {
      setCurrentVersion(current);
      setSelectedVersion(current);
    }
  };

  const handleUpdate = useCallback(
    (updatedVersion: Partial<ProjectVersion>) => {
      if (project && currentVersion) {
        const newVersion: ProjectVersion = {
          ...currentVersion,
          ...updatedVersion,
          updatedAt: new Date(),
        };
        setCurrentVersion(newVersion);
        setProject((prevProject: any) => ({
          ...prevProject!,
          versions: [newVersion, ...prevProject!.versions.slice(1)],
        }));
      }
    },
    [project, currentVersion]
  );

  const addNewPhase = useCallback(
    (phaseType: PhaseType) => {
      if (currentVersion) {
        const newPhase: ProjectPhase = {
          id: (currentVersion.phases.length + 1).toString(),
          projectVersionId: currentVersion?.id ?? "",
          name: "Nova Fase",
          weeks: 2,
          isIndependent: false,
          startDate: new Date().toString(),
          independentDate: new Date(),
          phaseOrder: currentVersion.phases.length + 1,
          phaseType: phaseType,
          milestones: [],
        };

        handleUpdate({
          phases: [...currentVersion.phases, newPhase],
        });
      }
    },
    [currentVersion, handleUpdate]
  );

  const deletePhase = useCallback(
    (id: string) => {
      if (currentVersion) {
        handleUpdate({
          phases: currentVersion.phases.filter(
            (phase: ProjectPhase) => phase.id !== id
          ),
        });
      }
    },
    [currentVersion, handleUpdate]
  );

  const handleCreateAndUpdateProject = async (data: NewProjectFormType) => {
    if (!project) return;

    let projectId = project.id;
    project.cod = data.cod;
    if (!project.id && !id) {
      const responseCreateProject = await createProject(project);
      projectId = responseCreateProject.id;
    } else {
      const responseUpdateProject = await updateProjectApi(project);
      projectId = responseUpdateProject.id;
    }

    if (currentVersion) {
      const versionData = {
        ...currentVersion,
        projectId: projectId,
        version: id
          ? (Number.parseFloat(currentVersion.version) + 0.1).toFixed(1)
          : "1.0",
        address: data.address,
        city: data.city,
        district: data.district,
        state: data.state,
        title: data.title,
        cep: data.cep,
      };

      const responseCreateVersion = await createVersion(versionData);

      if (currentVersion.phases) {
        for (const phase of currentVersion.phases) {
          const currentPhase = {
            ...phase,
            projectVersionId: responseCreateVersion.id,
          };
          const responseCreatePhase = await createPhase(currentPhase);

          if (currentPhase.milestones) {
            for (const milestone of currentPhase.milestones) {
              const milestoneData = {
                ...milestone,
                projectPhaseId: responseCreatePhase.id,
              };
              await createMilestone(milestoneData);
            }
          }
        }
      }
    }

    const updatedProject = await getProjectById(projectId);
    handleUpdatedData(updatedProject);
    navigate(`/project/${projectId}`);
  };

  const handleGoToHome = () => {
    navigate("/home");
  };

  if (!project || !currentVersion) {
    return <LoadingSpinner />;
  }

  const calculatePhaseStartDate = (
    phaseIndex: number,
    phases: ProjectPhase[]
  ): string => {
    let startDate = new Date(currentVersion!.startDate);
    for (let i = 0; i < phaseIndex; i++) {
      startDate.setDate(startDate.getDate() + phases[i].weeks * 7);
    }
    startDate.setDate(startDate.getDate() + phases[phaseIndex].weeks * 7);
    return startDate.toISOString().split("T")[0];
  };

  const projectPhases = currentVersion?.phases?.filter(
    (phase: ProjectPhase) => phase.phaseType === PhaseType.PROJECT
  );
  const constructionPhases = currentVersion?.phases?.filter(
    (phase: ProjectPhase) => phase.phaseType === PhaseType.CONSTRUCTION
  );
  const totalProjectWeeks = currentVersion.phases.reduce((sum, phase) => {
    return phase.phaseType === PhaseType.PROJECT ? sum + phase.weeks : sum;
  }, 0);

  const totalConstructionWeeks = currentVersion.phases.reduce((sum, phase) => {
    return phase.phaseType === PhaseType.CONSTRUCTION ? sum + phase.weeks : sum;
  }, 0);

  const lastProjectPhaseEndDate = calculatePhaseStartDate(
    projectPhases.length - 1,
    projectPhases
  );
  if (lastProjectPhaseEndDate && !constructionStartDate) {
    setConstructionStartDate(lastProjectPhaseEndDate);
  }

  return (
    <div className="w-[98%] mx-auto max-h-screen mt-8 overflow-scroll bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="flex items-center gap-2">
{/*             <button onClick={handleGoToHome}>
              <ChevronLeft className="h-5 w-5 font-bold" />
            </button> */}
            <h1 className="text-2xl font-bold">Cronograma do Projeto</h1>
          </span>
          <div className="flex gap-2">
            <Button
              className="flex items-center text-white gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
              form="registerProject"
              type="submit"
              disabled={isSubmitting}
            >
              <Save size={20} />
              Salvar Configurações
            </Button>
            <select
              className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
              value={selectedVersion?.id || ""}
              onChange={(e) => handleChangeSelectVersion(e.target.value)}
            >
              <option value="" disabled>
                Selecione uma versão
              </option>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  Versão {version.version}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-8 mb-6">
            <div className="w-[20%] flex flex-col items-start">
              <div className="relative w-32 h-32 mb-4 bg-black rounded-lg">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STG_ICON_LOW-001-MpE6LuBK5SE8fiPQ69rXmRfLqi8Bqe.png"
                  alt="STG Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <form
              id="registerProject"
              onSubmit={handleSubmit(handleCreateAndUpdateProject)}
              className="bg-transparent grid grid-cols-5 gap-2"
            >
              <Input
                {...register("title")}
                placeholder="Nome"
                className="bg-transparent focus:border-none col-span-3"
              />
              <Input
                {...register("cod")}
                placeholder="Código"
                className="bg-transparent focus:border-none col-span-2"
              />
              <Input
                {...register("cep")}
                placeholder="Cep"
                className="bg-transparent focus:border-none col-span-2"
              />

              <Input
                disabled
                {...register("address")}
                placeholder="Rua"
                className="col-span-3"
              />
              <Input
                disabled
                {...register("district")}
                placeholder="Bairro"
                className="col-span-1"
              />
              <Input
                disabled
                {...register("city")}
                placeholder="Cidade"
                className="col-span-2"
              />
              <Input
                disabled
                {...register("state")}
                placeholder="UF"
                className="border-none col-span-1"
              />

              <Input
                className="bg-transparent"
                {...register("startDate")}
                placeholder="Data"
                id="start-date"
                type="date"
              />
            </form>
          </div>

          <footer className="flex justify-between items-center py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">@2025</div>
            <div className="text-sm text-gray-500">WWW.STAGEAEC.COM.BR</div>
          </footer>
        </div>

        <div className="mt-12 mb-8 border-b pb-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Fases de Projeto</h2>
              <p className="text-sm text-gray-600">
                Total: {totalProjectWeeks} semanas (
                {(totalProjectWeeks / 4).toFixed(1)} meses)
              </p>
            </div>
          </div>
          <Button
            onClick={() => addNewPhase(PhaseType.PROJECT)}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Fase
          </Button>
        </div>

        <TimelineSection
          phases={projectPhases}
          onUpdate={(updatedPhases: any) =>
            handleUpdate({
              phases: [...updatedPhases, ...(constructionPhases ?? [])],
            })
          }
          onDeletePhase={deletePhase}
          totalWeeks={totalProjectWeeks}
          projectStartDate={currentVersion.startDate.toString()}
        />

        <div className="mt-12 mb-8 border-b pb-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Fases de Obra</h2>
              <p className="text-sm text-gray-600">
                Total: {totalConstructionWeeks} semanas (
                {(totalConstructionWeeks / 4).toFixed(1)} meses)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="construction-start-date">
                Data de Início da Obra:
              </Label>
              <Input
                id="construction-start-date"
                type="date"
                value={constructionStartDate}
                onChange={(e) => setConstructionStartDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
          <Button
            onClick={() => addNewPhase(PhaseType.CONSTRUCTION)}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Fase
          </Button>
        </div>

        <TimelineSection
          phases={constructionPhases}
          onUpdate={(updatedPhases: any) =>
            handleUpdate({
              phases: [...(projectPhases ?? []), ...updatedPhases],
            })
          }
          onDeletePhase={(id) => deletePhase(id)}
          totalWeeks={totalConstructionWeeks}
          projectStartDate={constructionStartDate?.toString() ?? ""}
        />
        {currentVersion && (
          <div className="mt-8 pt-4 border-t-2 mb-8">
            <GanttChart projectVersion={currentVersion} />
          </div>
        )}
      </div>

      <ExportButtons projectVersion={currentVersion!} />
    </div>
  );
}
