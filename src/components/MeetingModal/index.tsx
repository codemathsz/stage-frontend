import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMeetingsObjectives } from "@/api/meet-api/get-meeting-objectives";
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
import { MeetType } from "@/types";
import { useState } from "react";

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
  participants: z.string().min(1, "Informe o participante da reunião."),
  meetingAgenda: z.string().min(1, "Informe a pauta da reunião."),
});

type NewMeetingFormType = z.infer<typeof newMeeting>;

export function MeetingModal({ onClose, projectPhaseId }: MeetingModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, control } = useForm<NewMeetingFormType>({
    resolver: zodResolver(newMeeting),
  });

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
    mutationFn: (meet: MeetType) => createMeeting(meet),
  });

  async function handleCreateMeeting(data: NewMeetingFormType) {
    const agenda = JSON.parse(data.meetingAgenda);

    const meetData = {
      title: data.title,
      meetObjectiveId: data.meetingType,
      meetDate: data.meetingDate,
      meetTimeStart: data.meetingHourStart,
      meetTimeFinish: data.meetingHourFinish,
      moderator: data.moderator,
      participants: [data.participants],
      agendas: [
        {
          name: agenda.name,
          agendaTypeId: agenda.id,
        },
      ],
      projectPhaseId: projectPhaseId,
    };

    await createMeetingFn(meetData);
  }

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
              <Label className="text-sm font-medium">Participantes</Label>
              <Input
                type="text"
                placeholder="Digite algo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                  setIsOpen(true);
                }}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Fecha o select ao perder o foco
                className="flex-1"
              />
              {isOpen && (
                <Controller
                  name="participants"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um participante" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100">
                        {participants?.map((participant) => {
                          return (
                            <SelectItem value={participant.id}>
                              {participant.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Pautas</Label>
            <Controller
              name="meetingAgenda"
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
                        <SelectItem value={JSON.stringify(agenda)}>
                          {agenda.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
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
              className="flex gap-2 items-center rounded-md border bg-primary text-white px-4 py-2"
            >
              Criar Reunião
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
