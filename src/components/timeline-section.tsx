import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  CircleArrowDown,
  Save,
  CircleArrowUp,
  CalendarCheck2,
  FolderOpen,
} from "lucide-react";
import { Milestone, ProjectPhase } from "@/types";
import { formatDate } from "@/lib/utils";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createMilestone } from "@/api/milestone-api";
import { toast } from "sonner";

interface TimelineSectionProps {
  phases: ProjectPhase[];
  totalWeeks: number;
  onUpdate: (updatedPhases: ProjectPhase[]) => void;
  projectStartDate: string;
  onDeletePhase: (id: string) => void;
  idProject?: string;
}

const marcoProps = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  date: z.string().min(1, "A data é obrigatória"),
  phaseId: z.string().min(1, "A fase é obrigatória"),
});

type NewMarco = z.infer<typeof marcoProps>;

export function TimelineSection({
  phases,
  totalWeeks,
  onUpdate,
  projectStartDate,
  onDeletePhase,
  idProject,
}: TimelineSectionProps) {
  const calculatePhaseStartDate = (phaseIndex: number): string => {
    const startDate = new Date(projectStartDate);
    for (let i = 0; i < phaseIndex; i++) {
      startDate.setDate(startDate.getDate() + phases[i].weeks * 7);
    }
    return startDate.toISOString().split("T")[0];
  };

  const validateDate = (date: string, phaseStartDate: string) => {
    const projectStart = new Date(projectStartDate);
    const phaseStart = new Date(phaseStartDate);
    const selectedDate = new Date(date);
    return selectedDate >= projectStart && selectedDate >= phaseStart;
  };

  const handleWeekChange = (id: string, weeks: number) => {
    const updatedPhases = phases.map((phase) =>
      phase.id === id ? { ...phase, weeks } : phase
    );
    onUpdate(updatedPhases);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewMarco>({
    resolver: zodResolver(marcoProps),
  });

  const handleIndependentChange = (
    id: string,
    isIndependent: boolean,
    startDate?: string
  ) => {
    const updatedPhases = phases.map((phase) =>
      phase.id === id
        ? {
            ...phase,
            isIndependent,
            startDate: isIndependent
              ? startDate || projectStartDate
              : new Date().toString(),
          }
        : phase
    );
    onUpdate(updatedPhases);
  };

  const handleStartDateChange = (id: string, startDate: string) => {
    if (!validateDate(startDate, projectStartDate)) {
      alert("A data deve ser posterior à data de início do projeto");
      return;
    }
    const updatedPhases = phases.map((phase) =>
      phase.id === id ? { ...phase, startDate: startDate } : phase
    );
    onUpdate(updatedPhases);
  };

  console.log(errors);

  const handleMovePhase = (index: number, direction: "up" | "down") => {
    const newPhases = [...phases];
    if (direction === "up" && index > 0) {
      [newPhases[index - 1], newPhases[index]] = [
        newPhases[index],
        newPhases[index - 1],
      ];
    } else if (direction === "down" && index < newPhases.length - 1) {
      [newPhases[index], newPhases[index + 1]] = [
        newPhases[index + 1],
        newPhases[index],
      ];
    }
    onUpdate(newPhases);
  };

  const handleDeletePhase = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta fase?")) {
      onDeletePhase(id);
    }
  };

  const [openFormPhaseId, setOpenFormPhaseId] = useState<string | null>(null);

  const { mutateAsync: createMilestoneFn } = useMutation({
    mutationFn: (milestone: Milestone) => createMilestone(milestone),
  });

  async function handleAddMilestone(data: NewMarco) {
    try {
      await createMilestoneFn({
        date: new Date(data.date),
        name: data.name,
        projectPhaseId: data.phaseId,
        id: idProject ?? "",
      });
      toast.success("Marco criado com sucesso.");
      setOpenFormPhaseId(null);
    } catch {
      toast.error("Houve um erro ao tentar criar, tente novamente.");
    }
  }  

  return (
    <div className="mb-8">
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Input
                  value={phase.name}
                  onChange={(e) => {
                    const updatedPhases = [...phases];
                    updatedPhases[index].name = e.target.value;
                    onUpdate(updatedPhases);
                  }}
                  className="font-medium"
                />
              </div>
              <div className="text-sm text-gray-600">
                Início:{" "}
                {formatDate(
                  phase.isIndependent
                    ? phase.startDate.toString()!
                    : calculatePhaseStartDate(index)
                )}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={phase.weeks}
                  onChange={(e) =>
                    handleWeekChange(phase.id, parseInt(e.target.value) || 0)
                  }
                  className="w-20 p-1"
                />
                <span className="text-sm text-gray-600">semanas</span>
              </div>
              <div className="flex-1 h-8 bg-gray-200 rounded">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{
                    width: `${(phase.weeks / totalWeeks) * 100}%`,
                    backgroundColor: `rgba(240, 139, 107, ${1 - index * 0.1})`,
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Independente</span>
                <Switch
                  checked={phase.isIndependent}
                  onCheckedChange={(checked) =>
                    handleIndependentChange(phase.id, checked)
                  }
                />
              </div>
              {phase.isIndependent && (
                <Input
                  type="date"
                  value={phase.startDate.toString()}
                  onChange={(e) =>
                    handleStartDateChange(phase.id, e.target.value)
                  }
                  className="w-40"
                />
              )}
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMovePhase(index, "up")}
                  disabled={
                    index === 0 ||
                    (index > 0 && phases[index - 1].startDate !== null)
                  }
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMovePhase(index, "down")}
                  disabled={index === phases.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePhase(phase.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenFormPhaseId(
                    openFormPhaseId === phase.id ? null : phase.id
                  )
                }
                className="cursor-pointer gap-2 px-4 py-2 text-white rounded bg-gray-300"
              >
                <div className="flex gap-2">
                  {openFormPhaseId === phase.id ? (
                    <CircleArrowUp className="text-black" />
                  ) : (
                    <CircleArrowDown className="text-black" />
                  )}

                  <p className="text-black font-medium">Adicionar marco</p>
                </div>
              </button>

              {openFormPhaseId === phase.id && (
                <div key={phase.id} className="mt-5 bg-gray-100 p-4 rounded">
                  <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit(handleAddMilestone)}
                  >
                    <input
                      {...register("phaseId")}
                      type="hidden"
                      value={phase.id}
                    />
                    <Label>Nome do marco</Label>
                    <Input
                      {...register("name")}
                      placeholder="Ex: reunião com o cliente"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}

                    <Label>Data do marco</Label>
                    <Input
                      {...register("date")}
                      min={new Date().toISOString().split("T")[0]}
                      type="date"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm">
                        {errors.date.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="text-white w-40 mt-2 bg-black flex gap-2"
                    >
                      <Save /> Adicionar marco
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {phase.milestones.length > 0 && (
              <h1 className="font-bold">Marcos Adicionados:</h1>
            )}

            {phase.milestones &&
              phase.milestones.map((milestone) => (
                <div className="w-full flex">
                  <div className="bg-gray-200 p-2 w-fit min-w-52 rounded-sm">
                    <p className="flex items-center gap-1 font-medium text-sm">
                      <FolderOpen className="w-5 h-5 text-blue-500" />{" "}
                      {milestone.name}
                    </p>

                    <p
                      title="Data do marco"
                      className="flex items-center gap-1 font-medium text-sm"
                    >
                      <CalendarCheck2 className="w-5 h-5 text-blue-500" />
                      {formatDate(String(milestone.date))}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <p className="font-medium">
          Total: {totalWeeks} semanas ({(totalWeeks / 4).toFixed(1)} meses)
        </p>
      </div>
    </div>
  );
}
