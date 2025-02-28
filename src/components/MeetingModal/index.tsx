import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "../ui/button";

interface MeetingModalProps {
  onClose: () => void;
}

const newMeeting = z.object({
  title: z.string().min(1, "Informe o titulo da reunião."),
  meetingType: z.string().min(1, "Informe o Objetivo da reunião."),
  meetingDate: z.date().min(new Date(), { message: "Informe uma data válida." }),
  meetingHourStart: z.string().min(5, "Informe o horário de inicio da reunião."),
  meetingHourFinish: z.string().min(5, "Informe o horário de encerramento da reunião."),
  moderator: z.string().min(5, "Informe o moderador da reunião."),
  participants: z.string().min(5, "Informe o participante da reunião."),
  meetingAgenda: z.string().min(5, "Informe a pauta da reunião."),
});

type NewMeetingFormType = z.infer<typeof newMeeting>;

export function MeetingModal({onClose}: MeetingModalProps){

  const { register } = useForm<NewMeetingFormType>();

  return(
    <div className="fixed inset-0 flex items-center justify-center w-full h-screen bg-black bg-opacity-50 z-50">
      <div className="w-2/4 max-w-[45.9rem] bg-white flex flex-col gap-4 rounded-lg shadow-sm p-6 font-poppins">
        <div className="w-full flex justify-between">
          <h1 className="text-lg font-medium">Nova Reunião</h1>
          <X size={18} className="cursor-pointer" onClick={() => onClose()}/>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div>
            <Label className="text-sm font-medium">Titulo da reunião</Label>
            <Input
                {...register("title")}
                placeholder=""
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />
          </div>
          <div>
            <Label className="text-sm font-medium">Objetivo da reunião</Label>
            <Input
                {...register("meetingType")}
                placeholder="Informativa"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />
          </div>
          <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full flex items-center justify-between gap-4">
              <div className="w-1/2">
                <Label className="text-sm font-medium">Data</Label>
                <Input
                  {...register("meetingDate")}
                  placeholder="Data"
                  className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
                />
              </div>
              <div className="w-[45%]">
                <Label className="text-sm font-medium">Horário de Início</Label>
                <Input
                  {...register("meetingHourStart")}
                  placeholder="10:00"
                  className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
                />
              </div>
            </div>
            <div className="w-1/2">
              <Label className="text-sm font-medium">Horário de encerramento</Label>
              <Input
                {...register("meetingHourFinish")}
                placeholder="11:00"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Moderador</Label>
            <Input
                {...register("moderator")}
                placeholder="John Doe"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />
          </div>
          <div>
            <Label className="text-sm font-medium">Participantes</Label>
            <Input
                {...register("participants")}
                placeholder="Nome do participante"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />
          </div>
          <div>
            <Label className="text-sm font-medium">Pautas</Label>
            <Input
                {...register("meetingAgenda")}
                placeholder="Título da pauta"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
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
              className="flex gap-2 items-center rounded-md border bg-primary text-white px-4 py-2"
              onClick={() => alert('Em construção...')}
            >
              Criar Reunião
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}