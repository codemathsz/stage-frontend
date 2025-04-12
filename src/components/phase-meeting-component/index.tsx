import { ProjectPhase } from "@/types";
import { Plus } from "lucide-react";
import { PhaseMeetingCard } from "../phase-meeting-card";
import { useState } from "react";
import { MeetingModal } from "../MeetingModal";
import { useQuery } from "@tanstack/react-query";
import { getPhase } from "@/api/meet-api/get-phase";

interface PhaseMeetingProps {
  projectPhase: ProjectPhase;
}

export function PhaseMeetingComponent({ projectPhase }: PhaseMeetingProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const { data: meetingsByPhase } = useQuery({
    queryKey: ["get-phase-by-id", projectPhase.id],
    queryFn: () => getPhase(projectPhase.id),
  });

  return (
    <div className="w-full p-4 rounded-lg bg-gray-100 gap-4">
      <div className="w-full flex justify-between mb-8">
        <h1 className="font-poppins text-lg uppercase font-bold">
          {projectPhase.name}
        </h1>
        <div>
          <button
            className="flex gap-2 items-center rounded-md border border-gray-200 bg-white px-4 py-2"
            onClick={() => handleOpenModal()}
          >
            <Plus size={16} />
            <span>Adicionar Reunião</span>
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-4">
        {meetingsByPhase?.map((meet) => {
          return (
            <div key={meet.id} className="col-span-1">
              <PhaseMeetingCard meeting={meet} />
            </div>
          );
        })}
      </div>

      {openModal && (
        <MeetingModal
          action="create"
          projectPhaseId={projectPhase.id}
          onClose={() => handleOpenModal()}
        />
      )}
    </div>
  );
}
