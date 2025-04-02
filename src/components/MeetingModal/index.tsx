import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMeetingsObjectives } from "@/api/meet-api/get-meeting-objectives";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getUsers } from "@/api/meet-api/get-users";
import { getAgendas } from "@/api/meet-api/get-agendas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMeeting } from "@/api/meet-api/create-meeting";
import { useState } from "react";
import { AgendaType, User } from "@/types";

interface MeetingModalProps {
  onClose: () => void;
  projectPhaseId: string;
}

const newMeeting = z.object({
  title: z.string().min(1, "Informe o titulo da reunião."),
  meetingType: z.string().min(1, "Informe o Objetivo da reunião."),
  meetingDate: z.string().min(1, "Informe a data da reunião."),
  meetingHourFinish: z.string().min(1, "Informe a hora de fim da reunião."),
  meetingHourStart: z.string().min(1, "Informe a hora de inicio da reunião."),
  moderator: z.string().min(1, "Informe o moderador da reunião."),
  meetingAgendaName: z.string().min(1, "Informe a pauta da reunião."),
  meetingAgendaTypeId: z.array(
    z.string().min(1, "Informe a pauta da reunião.")
  ),
});

interface NewMeetProps {
  title: string;
  meetObjectiveId: string;
  meetDate: string;
  meetTimeStart: string;
  meetTimeFinish: string;
  moderator: string;
  participants: string[];
  agendas: {
    name: string;
    agendaTypeId: string;
  }[];
  projectPhaseId: string;
}

type NewMeetingFormType = z.infer<typeof newMeeting>;

export function MeetingModal({ onClose, projectPhaseId }: MeetingModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [pautas, setPautas] = useState<AgendaType[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewMeetingFormType>({
    resolver: zodResolver(newMeeting),
  });

  console.log(errors);

  const { data: meetingObjectives } = useQuery({
    queryFn: getMeetingsObjectives,
    queryKey: ["getAllObjectives"],
  });
  const { data: participants } = useQuery({
    queryFn: getUsers,
    queryKey: ["getAllParticipants"],
  });
  const { data: pautas } = useQuery({
    queryFn: getAgendas,
    queryKey: ["getAllPautas"],
  });

  const { mutateAsync: createMeetingFn } = useMutation({
    mutationFn: (meet: NewMeetProps) => createMeeting(meet),
  });

  const filteredParticipants = participants?.filter((participant) => {
    return participant.name.toLowerCase().includes(query.toLowerCase());
  });

  function handleAddPautas(agenda: AgendaType) {
    setPautas([...pautas, agenda]);
  }

  async function handleCreateMeeting(data: NewMeetingFormType) {
    const meetData: NewMeetProps = {
      title: data.title,
      meetObjectiveId: data.meetingType,
      meetDate: data.meetingDate,
      meetTimeStart: data.meetingHourStart,
      meetTimeFinish: data.meetingHourFinish,
      moderator: data.moderator,
      participants: selectedParticipants.map((p) => p.id),
      agendas: [
        {
          name: data.meetingAgendaName,
          agendaTypeId: data.meetingAgendaTypeId,
        },
      ],
      projectPhaseId: projectPhaseId,
    };
    await createMeetingFn(meetData);
    toast.success("Reunião criada com sucesso!");
  }

  // Adiciona ou remove um participante da lista
  const handleSelectParticipant = (participant: User) => {
    setSelectedParticipants((prev) => {
      // Verifica se o participante já foi adicionado
      if (prev.some((p) => p.id === participant.id)) {
        return prev.filter((p) => p.id !== participant.id);
      }
      return [...prev, participant];
    });

    setQuery("");
    setOpen(false);
  };

  const handleRemoveParticipant = (id: string) => {
    setSelectedParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-screen bg-black bg-opacity-50 z-50">
      <div className="w-2/4 max-w-[45.9rem] bg-white flex flex-col gap-4 rounded-lg shadow-sm p-6 font-poppins">
        <div className="w-full flex justify-between">
          <h1 className="text-lg font-medium">Nova Reunião</h1>
          <X size={18} className="cursor-pointer" onClick={() => onClose()} />
        </div>
        <form
          onSubmit={handleSubmit(handleCreateMeeting)}
          className="w-full flex flex-col gap-4"
        >
          <div>
            <Label className="text-sm font-medium">Titulo da reunião</Label>
            <Input
              {...register("title")}
              placeholder="Titulo da reunião"
              className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Objetivo da reunião</Label>
            <Controller
              name="meetingType"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100">
                    {meetingObjectives?.map((objective) => {
                      return (
                        <SelectItem value={objective.id}>
                          {objective.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full">
              <Label className="text-sm font-medium">Data</Label>
              <Input
                type="date"
                {...register("meetingDate")}
                placeholder="Data"
                className="bg-transparent placeholder:text-gray-500 focus:border-none w-full"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-between gap-4">
            <div className="w-1/2">
              <Label className="text-sm font-medium">
                Horário de encerramento
              </Label>
              <Input
                type="time"
                {...register("meetingHourFinish")}
                placeholder="11:00"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />
            </div>

            <div className="w-[45%]">
              <Label className="text-sm font-medium">Horário de Início</Label>
              <Input
                type="time"
                {...register("meetingHourStart")}
                placeholder="10:00"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium ">Moderador</Label>
            <Input
              {...register("moderator")}
              placeholder="John Doe"
              className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
            />

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Participantes</label>

              <Input
                type="text"
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder="Digite o participante"
                value={query}
                className="border p-2 rounded-md"
              />

              {/* Lista de participantes selecionados */}
              <div className="flex flex-wrap gap-2">
                {selectedParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-md"
                  >
                    <span>{participant.name} -</span>
                    <span className="">{participant.role.name}</span>
                    <button
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className="text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Dropdown de sugestões */}
              {isOpen &&
                query &&
                filteredParticipants &&
                filteredParticipants?.length > 0 && (
                  <div className="w-full flex flex-col gap-2">
                    <ul className="bg-white shadow-xl p-2 rounded-md flex flex-col gap-4">
                      {filteredParticipants.map((participant) => (
                        <li
                          key={participant.id}
                          onClick={() => handleSelectParticipant(participant)}
                          className="flex font-semibold items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                        >
                          {participant.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Pautas</Label>
            <div className="flex gap-3">
              <Input
                {...register("meetingAgendaName")}
                placeholder="Titulo da pauta"
              />
              <Controller
                name="meetingAgendaTypeId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma pauta" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-100">
                      {pautas?.map((agenda) => {
                        return (
                          <SelectItem value={agenda.id}>
                            {agenda.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              <Button onClick={handleAddPautas} className="text-white bg-black">Adicionar</Button>
            </div>
          </div>
          <div className="w-full flex justify-end gap-2">
            <Button
              className="flex gap-2 items-center rounded-md border hover:bg-gray-200 border-gray-200 bg-white px-4 py-2"
              onClick={() => onClose()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex gap-2 items-center rounded-md border bg-black text-white px-4 py-2"
            >
              Criar Reunião
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
