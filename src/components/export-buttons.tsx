import { useState } from "react"
import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PhaseType, ProjectVersion } from "@/types"

interface ExportButtonsProps {
  projectVersion: ProjectVersion
}

export function ExportButtons({ projectVersion }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      let csvContent = "data:text/csv;charset=utf-8,"

      // Headers
      csvContent += "Fase,Duração (semanas),Data de Início,Data de Término Prevista,Independente,Marcos\n"

      // START
      csvContent += `START,0,${projectVersion.startDate.toISOString().split("T")[0]},,Sim,\n`

      // Project Phases
      projectVersion.phases
        .filter((phase) => phase.phaseType === PhaseType.PROJECT)
        .forEach((phase) => {
          const startDate = phase.isIndependent ? phase.independentDate : phase.startDate
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + phase.weeks * 7)
          const row = [
            phase.name,
            phase.weeks,
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0],
            phase.isIndependent ? "Sim" : "Não",
            phase.milestones.map((m) => `${m.name}: ${m.date.toISOString().split("T")[0]}`).join("; "),
          ]
          csvContent += row.join(",") + "\n"
        })

      // Construction Phases
      projectVersion.phases
        .filter((phase) => phase.phaseType === PhaseType.CONSTRUCTION)
        .forEach((phase) => {
          const startDate = phase.isIndependent ? phase.independentDate : phase.startDate
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + phase.weeks * 7)
          const row = [
            phase.name,
            phase.weeks,
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0],
            phase.isIndependent ? "Sim" : "Não",
            phase.milestones.map((m) => `${m.name}: ${m.date.toISOString().split("T")[0]}`).join("; "),
          ]
          csvContent += row.join(",") + "\n"
        })

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `cronograma_${projectVersion.title}_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert("CSV exportado com sucesso!")
    } catch (error) {
      console.error("Erro ao exportar CSV:", error)
      alert("Erro ao exportar o CSV. Por favor, tente novamente.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <Button onClick={handleExportCSV} disabled={isExporting} className="flex items-center gap-2">
        <FileSpreadsheet size={20} />
        Exportar CSV
      </Button>
    </div>
  )
}

