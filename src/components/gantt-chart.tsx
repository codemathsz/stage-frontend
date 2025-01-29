import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Download } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { PhaseType, ProjectPhase, ProjectVersion } from "@/types"
import { formatDate } from "@/lib/utils"

interface GanttChartProps {
  projectVersion: ProjectVersion
}

export function GanttChart({ projectVersion }: GanttChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [horizontalScroll, setHorizontalScroll] = useState(0)
  const [verticalScroll, setVerticalScroll] = useState(0)

  const getWeeksBetweenDates = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
  }

  const addWeeksToDate = (date: string, weeks: number) => {
    const newDate = new Date(date);
    newDate.setUTCDate(newDate.getUTCDate() + weeks * 7);
    return newDate.toISOString().split("T")[0];
  };  

  const calculatePhaseDates = (phases: ProjectPhase[], startDate: Date) => {
    let currentDate = new Date(startDate)
    return phases.map((phase, index) => {
      if (phase.isIndependent && phase.independentDate) {
        currentDate = phase.independentDate
      } else if (index > 0) {
        currentDate = new Date(currentDate?.getTime())
      }
      const updatedPhase = { ...phase, startDate: currentDate }
      currentDate.setDate(currentDate?.getDate() + phase.weeks * 7)
      return updatedPhase
    })
  }

  const drawChart = (ctx: CanvasRenderingContext2D, width: number, height: number, isExport = false) => {
    const projectPhases = calculatePhaseDates(
      projectVersion?.phases.filter((phase) => phase.phaseType === PhaseType.PROJECT),
      projectVersion.startDate,
    )
    const constructionPhases = calculatePhaseDates(
      projectVersion?.phases.filter((phase) => phase.phaseType === PhaseType.CONSTRUCTION),
      projectVersion.constructionStartDate,
    )
    const allPhases = [...projectPhases, ...constructionPhases]
    const totalWeeks = allPhases.reduce((sum, phase) => sum + phase.weeks, 0)

    const phaseHeight = 40 * zoom
    const headerHeight = 80 * zoom
    const weekWidth = Math.max((width - 200) / totalWeeks, 20) * zoom
    const milestoneRadius = 4 * zoom
    const milestonePadding = 5 * zoom
    const fontSize = 12 * zoom

    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    // Apply scrolling (only if not exporting)
    if (!isExport) {
      ctx.save()
      ctx.translate(-horizontalScroll * (width - 200), -verticalScroll * height)
    }

    // Draw header
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(200, 0, width - 200, headerHeight)

    // Initialize currentWeek and currentDate
    let currentWeek = 0
    const currentDate = new Date(projectVersion.startDate);

    // Draw month divisions and labels
    ctx.fillStyle = "#374151"
    ctx.font = `${fontSize}px Inter`
    while (currentWeek < totalWeeks) {
      const x = 200 + currentWeek * weekWidth
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.strokeStyle = "#e5e7eb"
      ctx.stroke()

      const monthLabel = formatDate(currentDate.toISOString().split("T")[0])
      ctx.fillText(monthLabel, x + 5, 20)

      currentDate.setMonth(currentDate.getMonth() + 1)
      currentWeek = getWeeksBetweenDates(new Date(projectVersion.startDate).toISOString(), currentDate.toISOString().split("T")[0])
    }

    // Draw week numbers
    ctx.fillStyle = "#374151"
    ctx.font = `${fontSize}px Inter`
    for (let i = 0; i < totalWeeks; i++) {
      ctx.fillText(`${i + 1}`, 200 + i * weekWidth + 10, headerHeight - 10)
    }

    // Reset currentWeek for phase drawing
    currentWeek = 0
    let currentY = headerHeight

    // Draw project phases header
    ctx.fillStyle = "#000000"
    ctx.font = `bold ${fontSize}px Inter`
    ctx.fillText("Fases de Projeto", 10, currentY + 25)
    currentY += 40

    // Draw project phases
    projectPhases.forEach((phase, index) => {
      const phaseStartWeek = getWeeksBetweenDates(new Date(projectVersion.startDate).toISOString(), phase.startDate.toISOString())
      const x = 200 + phaseStartWeek * weekWidth
      const barWidth = phase.weeks * weekWidth

      // Draw phase bar
      const phaseColor = `rgba(240, 139, 107, ${1 - index * 0.05})`
      ctx.fillStyle = phaseColor
      ctx.fillRect(x, currentY + 10, barWidth, phaseHeight - 20)

      // Phase name
      ctx.fillStyle = "#111827"
      ctx.font = `${fontSize}px Inter`
      ctx.fillText(phase.name, 10, currentY + 25)

      // Week count and start date
      ctx.fillStyle = "#ffffff"
      ctx.font = `${fontSize}px Inter`
      ctx.fillText(`${phase.weeks}s`, x + 5, currentY + 28)

      // Draw milestones
      phase.milestones.forEach((milestone, milestoneIndex) => {
        const milestoneDate = new Date(milestone.date)
        const milestoneWeeks = (milestoneDate.getTime() - phase.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        const milestoneX = x + milestoneWeeks * weekWidth
        const milestoneY = currentY + phaseHeight + milestoneIndex * (milestoneRadius * 2 + milestonePadding)

        ctx.beginPath()
        ctx.arc(milestoneX, milestoneY, milestoneRadius, 0, 2 * Math.PI)
        ctx.fillStyle = "#000000"
        ctx.fill()

        ctx.fillStyle = "#111827"
        ctx.font = `${fontSize}px Inter`
        ctx.fillText(milestone.name, milestoneX + milestoneRadius + milestonePadding, milestoneY + 3)
      })

      currentY += phaseHeight + phase.milestones.length * (milestoneRadius * 2 + milestonePadding) + 10
    })

    // Draw division line
    ctx.beginPath()
    ctx.moveTo(0, currentY)
    ctx.lineTo(width, currentY)
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.stroke()
    currentY += 20

    // Draw construction phases header
    ctx.fillStyle = "#000000"
    ctx.font = `bold ${fontSize}px Inter`
    ctx.fillText("Fases de Obra", 10, currentY + 25)
    currentY += 40

    // Draw construction phases
    constructionPhases.forEach((phase, index) => {
      const phaseStartWeek = getWeeksBetweenDates(new Date(projectVersion.constructionStartDate).toISOString(), phase.startDate.toISOString())
      const x = 200 + phaseStartWeek * weekWidth
      const barWidth = phase.weeks * weekWidth

      const phaseColor = `rgba(139, 195, 74, ${1 - index * 0.05})`
      ctx.fillStyle = phaseColor
      ctx.fillRect(x, currentY + 10, barWidth, phaseHeight - 20)

      ctx.fillStyle = "#111827"
      ctx.font = `${fontSize}px Inter`
      ctx.fillText(phase.name, 10, currentY + 25)

      ctx.fillStyle = "#ffffff"
      ctx.font = `${fontSize}px Inter`
      ctx.fillText(`${phase.weeks}s`, x + 5, currentY + 28)

      phase.milestones.forEach((milestone, milestoneIndex) => {
        const milestoneDate = new Date(milestone.date)
        const milestoneWeeks = (milestoneDate.getTime() - phase.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        const milestoneX = x + milestoneWeeks * weekWidth
        const milestoneY = currentY + phaseHeight + milestoneIndex * (milestoneRadius * 2 + milestonePadding)

        ctx.beginPath()
        ctx.arc(milestoneX, milestoneY, milestoneRadius, 0, 2 * Math.PI)
        ctx.fillStyle = "#000000"
        ctx.fill()

        ctx.fillStyle = "#111827"
        ctx.font = `${fontSize}px Inter`
        ctx.fillText(milestone.name, milestoneX + milestoneRadius + milestonePadding, milestoneY + 3)
      })

      currentY += phaseHeight + phase.milestones.length * (milestoneRadius * 2 + milestonePadding) + 10
    })

    if (!isExport) {
      ctx.restore()
    }
  }

  const exportToImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calcule o tamanho total do cronograma
    const projectPhases = projectVersion?.phases.filter((phase) => phase.phaseType === PhaseType.PROJECT)
    const constructionPhases = projectVersion?.phases.filter((phase) => phase.phaseType === PhaseType.CONSTRUCTION)
    const allPhases = [...projectPhases, ...constructionPhases]
    const totalWeeks = allPhases.reduce((sum, phase) => sum + phase.weeks, 0)
    const totalHeight = allPhases.reduce((sum, phase) => {
      return sum + 40 + phase.milestones.length * 15 + 10
    }, 180)

    // Ajuste o tamanho do canvas para acomodar todo o cronograma
    const exportZoom = 1 // Use zoom 1 para exportação
    const exportWidth = Math.max(canvas.width, (totalWeeks * 20 + 200) * exportZoom)
    const exportHeight = Math.max(canvas.height, (totalHeight + 200) * exportZoom)

    // Crie um canvas temporário para a exportação
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = exportWidth
    tempCanvas.height = exportHeight
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    // Desenhe o fundo branco
    tempCtx.fillStyle = "#ffffff"
    tempCtx.fillRect(0, 0, exportWidth, exportHeight)

    // Desenhe o cabeçalho
    tempCtx.fillStyle = "#000000"
    tempCtx.font = "bold 20px Inter"
    tempCtx.fillText("Stage.AEC", 20, 30)

    tempCtx.font = "bold 16px Inter"
    tempCtx.fillText(`${projectVersion?.title} • ${projectVersion.title}`, 20, 60)

    tempCtx.font = "14px Inter"
    tempCtx.fillText(`${projectVersion.city}, ${projectVersion.state}`, 20, 90)
    tempCtx.fillText(`Início do Projeto: ${formatDate(projectVersion.startDate.toISOString().split("T")[0])}`, 20, 120)

    const projectEndDate = new Date(projectVersion.startDate)
    projectEndDate.setDate(
      projectEndDate.getDate() +
        projectVersion?.phases
          .filter((phase) => phase.phaseType === PhaseType.PROJECT)
          .reduce((sum, phase) => sum + phase.weeks * 7, 0),
    )
    tempCtx.fillText(`Fim do Projeto: ${formatDate(projectEndDate.toISOString().split("T")[0])}`, 20, 150)

    tempCtx.fillText(
      `Início da Obra: ${formatDate(projectVersion.constructionStartDate.toISOString().split("T")[0])}`,
      20,
      180,
    )

    const constructionEndDate = new Date(projectVersion.constructionStartDate)
    constructionEndDate.setDate(
      constructionEndDate.getDate() +
        projectVersion?.phases
          .filter((phase) => phase.phaseType === PhaseType.CONSTRUCTION)
          .reduce((sum, phase) => sum + phase.weeks * 7, 0),
    )
    tempCtx.fillText(`Fim da Obra: ${formatDate(constructionEndDate.toISOString().split("T")[0])}`, 20, 210)

    // Desenhe o cronograma
    tempCtx.translate(0, 240)
    drawChart(tempCtx, exportWidth, exportHeight - 240, true)

    try {
      const dataUrl = tempCanvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `gantt_${projectVersion?.title}_${new Date().toISOString().split("T")[0]}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error exporting image:", error)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      const allPhases = projectVersion?.phases
      const totalWeeks = allPhases.reduce((sum, phase) => sum + phase.weeks, 0)
      const totalHeight = allPhases.reduce((sum, phase) => {
        return sum + 40 + phase.milestones.length * 15 + 10
      }, 180)

      canvas.width = canvas.offsetWidth
      canvas.height = Math.max(canvas.offsetHeight, totalHeight * zoom)
      const weekWidth = Math.max((canvas.width - 200) / totalWeeks, 20) * zoom
      canvas.width = Math.max(canvas.offsetWidth, 200 + totalWeeks * weekWidth)
      drawChart(ctx, canvas.width, canvas.height)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [projectVersion, zoom, horizontalScroll, verticalScroll])

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <Button onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))} variant="outline" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))} variant="outline" size="icon">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button onClick={exportToImage} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar PNG
        </Button>
      </div>

      <div className="relative bg-white">
        <canvas ref={canvasRef} className="w-full h-[600px]" style={{ width: "100%", height: 600 }} />
      </div>

      <div className="mt-4">
        <Slider
          value={[horizontalScroll]}
          onValueChange={([value]:any) => setHorizontalScroll(value)}
          max={1}
          step={0.01}
          className="w-full"
        />
      </div>
      <div className="absolute top-20 right-2 h-[560px]">
        <Slider
          value={[verticalScroll]}
          onValueChange={([value]:any) => setVerticalScroll(value)}
          max={1}
          step={0.01}
          orientation="vertical"
          className="h-full"
        />
      </div>
    </div>
  )
}