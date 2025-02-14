import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, X, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Milestone, ProjectPhase } from "@/types";
import { formatDate, formatDateISO } from "@/lib/utils";

interface TimelineSectionProps {
  phases: ProjectPhase[];
  totalWeeks: number;
  onUpdate: (updatedPhases: ProjectPhase[]) => void;
  projectStartDate: string;
  onDeletePhase: (id: string) => void;
}

export function TimelineSection({
  phases,
  totalWeeks,
  onUpdate,
  projectStartDate,
  onDeletePhase,
}: TimelineSectionProps) {
  const [editingPhase, setEditingPhase] = useState<string | null>(null);

  const calculatePhaseStartDate = (phaseIndex: number): string => {
    let startDate = new Date(projectStartDate);
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

  const handleAddMilestone = (phaseId: string) => {
    const updatedPhases = phases.map((phase, index) => {
      if (phase.id === phaseId) {
        const phaseStartDate =
          phase.isIndependent && phase.startDate
            ? new Date(phase.startDate)
            : new Date(calculatePhaseStartDate(index));

        const newMilestoneDate = new Date(phaseStartDate);
        newMilestoneDate.setDate(newMilestoneDate.getDate() + 1); // Set to next day

        const newMilestone: Milestone = {
          id: "",
          name: "Novo Marco",

          id: "",
          name: "",

          date: newMilestoneDate,
          projectPhaseId: phase.id,
        };
        return { ...phase, milestones: [...phase.milestones, newMilestone] };
      }
      return phase;
    });
    onUpdate(updatedPhases);
  };

  const handleUpdateMilestone = (
    phaseId: string,
    milestoneId: string,
    updatedMilestone: Partial<Milestone>
  ) => {
    const updatedPhases = phases.map((phase, phaseIndex) => {
      if (phase.id === phaseId) {
        const phaseStartDate =
          phase.isIndependent && formatDateISO(phase.startDate)
            ? new Date(phase.startDate)
            : new Date(calculatePhaseStartDate(phaseIndex));

        const updatedMilestones = phase.milestones.map((milestone) => {
          if (milestone.id === milestoneId) {
            if (updatedMilestone.date) {
              if (updatedMilestone.date < phaseStartDate) {
                alert(
                  "A data do marco deve ser posterior à data de início da fase"
                );
                return milestone;
              }
              milestone.date = updatedMilestone.date;
            }
            return (milestone = { ...milestone, ...updatedMilestone });
          }
          return milestone;
        });
        return { ...phase, milestones: updatedMilestones };
      }
      return phase;
    });
    onUpdate(updatedPhases);
  };

  const handleRemoveMilestone = (phaseId: string, milestoneId: string) => {
    const updatedPhases = phases.map((phase) => {
      if (phase.id === phaseId) {
        const updatedMilestones = phase.milestones.filter(
          (milestone) => milestone.id !== milestoneId
        );
        return { ...phase, milestones: updatedMilestones };
      }
      return phase;
    });
    onUpdate(updatedPhases);
  };

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
                  onFocus={() => setEditingPhase(phase.id)}
                  onBlur={() => setEditingPhase(null)}
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
            <div className="ml-64 space-y-2">
              {phase.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2">
                  <Input
                    value={milestone.name}
                    placeholder="Novo Marco"
                    onChange={(e) =>
                      handleUpdateMilestone(phase.id, milestone.id, {
                        name: e.target.value,
                      })
                    }
                    className="w-48"
                  />
                  <Input
                    type="date"
                    value={milestone.date.toString()}
                    onChange={(e) =>
                      handleUpdateMilestone(phase.id, milestone.id, {
                        date: new Date(e.target.value),
                      })
                    }
                    className="w-40"
                    min={phase.startDate || projectStartDate}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleRemoveMilestone(phase.id, milestone.id)
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddMilestone(phase.id)}
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar Marco
              </Button>
            </div>
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
