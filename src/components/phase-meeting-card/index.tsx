import { MeetType } from "@/pages/Meet";
import { Link, Edit } from "lucide-react";

interface PhaseMeetingCardProps{
  meeting: MeetType
}

export function PhaseMeetingCard({meeting}:PhaseMeetingCardProps){

  return(
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex items-center justify-between">
          <span className="font-poppins text-base font-medium uppercase">{meeting?.cod}</span>
          <span className={`px-3 rounded-full text-white text-center ${meeting?.status === 'Pendente' ? 'bg-yellow-500' : 'bg-green-500'}`}>{meeting?.status}</span>
        </div>
        <span className="font-poppins text-gray-500 text-sm">{meeting?.meetingDate}</span>
        <span className="font-poppins text-base font-bold">{meeting?.title}</span>
        <span className="font-poppins text-gray-500 text-sm">Objetivo: {meeting?.objective}</span>
        <div className="w-full flex justify-between">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md">
            <Edit size={16}/>
            <span>Editar</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md">
            <Link size={16}/>
            <span>Abrir</span>
          </button>
        </div>
      </div>
    </div>
  )
}