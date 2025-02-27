import { ProjectPhase } from "@/types"
import { Plus } from "lucide-react";
import { PhaseMeetingCard } from "../phase-meeting-card";
import { MeetType } from "@/pages/Meet";
import { useState } from "react";
import { MeetingModal } from "../MeetingModal";

interface PhaseMeetingProps{
  projectPhase: ProjectPhase
  meeting: MeetType[]
}

export function PhaseMeetingComponent({projectPhase, meeting}: PhaseMeetingProps){
  const [openModal, setOpenModal] = useState<boolean>(false)

  const handleOpenModal = () =>{
    setOpenModal(!openModal)
  }
  return(
    <div className="w-full p-4 rounded-lg bg-gray-100 gap-4">
      <div className="w-full flex justify-between mb-8">
        <h1 className="font-poppins text-lg uppercase font-bold">{projectPhase.name}</h1>
        <div>
          <button 
            className="flex gap-2 items-center rounded-md border border-gray-200 bg-white px-4 py-2"
            onClick={() => handleOpenModal()}
          >
            <Plus size={16}/>
            <span>Adicionar Reunião</span>
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-4">
        {
          meeting.map((meet, _index) => {
            return (
              <div className="col-span-1">
                <PhaseMeetingCard key={meet.cod} meeting={meet}/>
              </div>
            )
          })
        }
      </div>

      {
        openModal && <MeetingModal onClose={() => handleOpenModal()}/>
      }
    </div>
  )
}