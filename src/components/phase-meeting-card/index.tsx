import { Link, Edit } from "lucide-react";
import { format } from "date-fns";
import { MeetType } from "@/types";
interface PhaseMeetingCardProps {
  meeting: MeetType;
}

export function PhaseMeetingCard({ meeting }: PhaseMeetingCardProps) {
 
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="w-full flex flex-col gap-3">
        <span className="font-poppins text-gray-500 text-sm">
          {format(meeting.meetDate, "dd/MM/yyyy")}
        </span>
        <span className="font-poppins text-base font-bold">
          {meeting?.title}
        </span>
        <span className="font-poppins text-gray-500 text-sm">
          Objetivo: {meeting?.meetObjective?.name}
        </span>
        <div className="w-full flex justify-between">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md">
            <Edit size={16} />
            <span>Editar</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md">
            <Link size={16} />
            <span>Abrir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
