import { ProjectPhase } from "@/types"
import { Plus } from "lucide-react";

interface PhaseMeetingProps{
  projectPhase: ProjectPhase
}

export function PhaseMeetingComponent({projectPhase}: PhaseMeetingProps){

  return(
    <div className="w-full p-4 rounded-lg bg-gray-100">
      <div className="w-full flex  justify-between">
        <h1 className="font-poppins text-lg uppercase font-bold">{projectPhase.name}</h1>
        <div>
          <button className="flex gap-2 items-center rounded-md border border-gray-200 bg-white px-4 py-2">
            <Plus size={16}/>
            <span>Adicionar Reunião</span>
          </button>
        </div>
      </div>
    </div>
  )
}