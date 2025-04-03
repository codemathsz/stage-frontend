import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Project, ProjectVersion } from "@/types"
import { formatDate, formatDateISO } from "@/lib/utils"

interface ProjectHeaderProps {
  project: Project | null
  projectData: ProjectVersion
  onUpdate: (updatedData: Partial<ProjectVersion>) => void
  onUpdateProject: (updatedData: Partial<Project>) => void
}

export function ProjectHeader({project, projectData, onUpdate, onUpdateProject }: ProjectHeaderProps) {

  const [isEditing, setIsEditing] = useState(false)

  const handleChangeProject = (field: keyof Project, value: string | Date) => {
    onUpdateProject!({
      [field]: value,
    })
  }

  const handleChange = (field: keyof ProjectVersion, value: string | Date) => {
    onUpdate({
      [field]: value,
    })
  }

  return (
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
          <Input
            type="text"
            value={project?.cod}
            placeholder="COD PROJETO"
            onChange={(e) => handleChangeProject("cod", e.target.value)}
            className="text-xl font-bold w-full"
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          />
          <div className="mt-4">
            <Label htmlFor="start-date">Data de START</Label>
            <Input
              id="start-date"
              type="date"
              value={formatDateISO(projectData?.startDate?.toString())}
              onChange={(e) => handleChange("startDate", new Date(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Right column with project details */}
        <div className="w-[80%]">
          <Input
            type="text"
            value={projectData?.title}
            placeholder="NOME DO PROJETO"
            onChange={(e) => handleChange("title", e.target.value)}
            className="text-3xl font-bold mb-4 w-full"
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          />
          <div className="text-gray-600 space-y-2">
            <Input
              type="text"
              value={projectData?.address}
              placeholder="ENDEREÇO DO PROJETO"
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full"
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
            />
            <div className="flex gap-2">
              <Input
                type="text"
                value={projectData?.district}
                placeholder="BAIRRO"
                onChange={(e) => handleChange("district", e.target.value)}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
              />
              <span>•</span>
              <Input
                type="text"
                value={projectData?.city}
                placeholder="CIDADE"
                onChange={(e) => handleChange("city", e.target.value)}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
              />
              <span>•</span>
              <Input
                type="text"
                value={projectData?.state}
                placeholder="UF"
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-16"
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4">
                <div>
                  <span className="text-sm text-gray-500">Versão:</span>
                  <span className="ml-2">{projectData?.version}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Atualizado em:</span>
                  {
                    projectData?.updatedAt && (
                      <span className="ml-2">{formatDate(projectData?.updatedAt?.toString())}</span>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with copyright and website */}
      <footer className="flex justify-between items-center py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">@2025</div>
        <div className="text-sm text-gray-500">WWW.STAGEAEC.COM.BR</div>
      </footer>
    </div>
  )
}