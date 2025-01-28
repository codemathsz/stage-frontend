import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, X, ChevronUp, ChevronDown, Trash2 } from "lucide-react"
import { Milestone, ProjectPhase } from "@/types"
import { formatDate } from "@/lib/utils"

interface TimelineSectionProps {
  title: string
  phases: ProjectPhase[] | undefined
  onUpdate: (updatedPhases: ProjectPhase[]) => void
  onDeletePhase: (id: string) => void
}

export function TimelineSection({ title, phases, onUpdate, onDeletePhase }: TimelineSectionProps) {
  const [editingPhase, setEditingPhase] = useState<string | null>(null)

  const calculatePhaseStartDate = (phaseIndex: number): string => {
    if(!phases) return ''
    const startDate = new Date(phases[0].startDate)
    for (let i = 0; i < phaseIndex; i++) {
      startDate.setDate(startDate.getDate() + phases[i]?.weeks * 7)
    }
    return startDate.toString().split("T")[0]
  }

  const handleWeekChange = (id: string, weeks: number) => {
    const updatedPhases = phases?.map((phase) => (phase.id === id ? { ...phase, weeks } : phase))
    if(updatedPhases){
      onUpdate(updatedPhases)
    }
  }

  const handleIndependentChange = (id: string, isIndependent: boolean) => {
    const updatedPhases = phases?.map((phase) =>
      phase.id === id
        ? {
            ...phase,
            isIndependent,
            independentDate: isIndependent ? new Date() : new Date(phase.startDate),
          }
        : phase,
    )
    if(updatedPhases){
      onUpdate(updatedPhases)
    }
  }

  const handleStartDateChange = (id: string, startDate: string) => {
    const updatedPhases = phases?.map((phase) =>
      phase.id === id ? { ...phase, startDate: new Date(startDate) } : phase,
    )
    if(updatedPhases){
      onUpdate(updatedPhases)
    }
  }

  const handleAddMilestone = (phaseId: string) => {
    const updatedPhases = phases?.map((phase) => {
      if (phase.id === phaseId) {
        const newMilestone: Milestone = {
          id: Date.now().toString(),
          projectPhaseId: phaseId,
          name: "Novo Marco",
          date: new Date(),
        }
        return { ...phase, milestones: [...phase.milestones, newMilestone] }
      }
      return phase
    })
    if(updatedPhases){
      onUpdate(updatedPhases)
    }
  }

  const handleUpdateMilestone = (phaseId: string, milestoneId: string, updatedMilestone: Partial<Milestone>) => {
    const updatedPhases = phases?.map((phase) => {
      if (phase.id === phaseId) {
        const updatedMilestones = phase.milestones.map((milestone) => {
          if (milestone.id === milestoneId) {
            return { ...milestone, ...updatedMilestone }
          }
          return milestone
        })
        return { ...phase, milestones: updatedMilestones }
      }
      return phase
    })
    if(updatedPhases){
      onUpdate(updatedPhases)
    }
  }

  const handleRemoveMilestone = (phaseId: string, milestoneId: string) => {
    const updatedPhases = phases?.map((phase) => {
      if (phase.id === phaseId) {
        const updatedMilestones = phase.milestones.filter((milestone) => milestone.id !== milestoneId)
        return { ...phase, milestones: updatedMilestones }
      }
      return phase
    })
    if(updatedPhases){
      onUpdate(updatedPhases)
    }
  }

  const handleMovePhase = (index: number, direction: "up" | "down") => {
    if(!phases) return
    const newPhases = [...phases]
    if (direction === "up" && index > 0) {
      ;[newPhases[index - 1], newPhases[index]] = [newPhases[index], newPhases[index - 1]]
    } else if (direction === "down" && index < newPhases.length - 1) {
      ;[newPhases[index], newPhases[index + 1]] = [newPhases[index + 1], newPhases[index]]
    }
    onUpdate(newPhases)
  }

  const handleDeletePhase = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta fase?")) {
      onDeletePhase(id)
    }
  }

  return (
    <div className="mb-8">
      <div className="space-y-4">
        {phases?.map((phase, index) => (
          <div key={phase.id} className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Input
                  value={phase.name}
                  onChange={(e) => {
                    const updatedPhases = [...phases]
                    updatedPhases[index].name = e.target.value
                    onUpdate(updatedPhases)
                  }}
                  className="font-medium"
                />
              </div>
              <div className="text-sm text-gray-600">Início: {formatDate(phase?.startDate?.toString())}</div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={phase.weeks}
                  onChange={(e) => handleWeekChange(phase.id, Number.parseInt(e.target.value) || 0)}
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
                    width: `${(phase.weeks / phases.reduce((sum, p) => sum + p.weeks, 0)) * 100}%`,
                    backgroundColor: `rgba(240, 139, 107, ${1 - index * 0.1})`,
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Independente</span>
                <Switch
                  checked={phase.isIndependent}
                  onCheckedChange={(checked:any) => handleIndependentChange(phase.id, checked)}
                />
              </div>
              {phase.isIndependent && (
                <Input
                  type="date"
                  value={phase?.independentDate?.toString().split("T")[0]}
                  onChange={(e) => handleStartDateChange(phase.id, e.target.value)}
                  className="w-40"
                />
              )}
              <div className="flex flex-col">
                <Button variant="ghost" size="icon" onClick={() => handleMovePhase(index, "up")} disabled={index === 0}>
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
                <Button variant="ghost" size="icon" onClick={() => handleDeletePhase(phase.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="ml-64 space-y-2">
              {phase.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2">
                  <Input
                    value={milestone.name}
                    onChange={(e) => handleUpdateMilestone(phase.id, milestone.id, { name: e.target.value })}
                    className="w-48"
                  />
                  <Input
                    type="date"
                    value={milestone.date.toString().split("T")[0]}
                    onChange={(e) => handleUpdateMilestone(phase.id, milestone.id, { date: new Date(e.target.value) })}
                    className="w-40"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveMilestone(phase.id, milestone.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => handleAddMilestone(phase.id)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Marco
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        {/* Total weeks calculation removed as it's not part of the updated code and relies on removed props */}
      </div>
    </div>
  )
}