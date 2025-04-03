import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { User } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";


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
  meetingAgendaTypeId: z.string().min(1, "Informe a pauta da reunião."),
  participants: z
    .array(
      z.object({
        id: z.string(), // ou `z.number()` dependendo do tipo real do ID
        name: z.string().min(1, "Nome é obrigatório"),
        role: z.object({
          id: z.string(),
          name: z.string(),
        }),
      })
    )
    .min(1, "É necessário adicionar pelo menos um participante"),

  pautas: z
    .array(
      z.object({
        name: z.string().min(1, "O título da pauta é obrigatório"),
        agendaTypeId: z.string().min(1, "O tipo da pauta é obrigatório"),
      })
    )
    .min(1, "Adicione pelo menos uma pauta")
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

type AgendaObject = {
  name: string,
  agendaTypeId: string
}

export function MeetingModal({ onClose, projectPhaseId }: MeetingModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [selectedPautasAdd, setSelectedPautasAdd] = useState<AgendaObject[]>([]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewMeetingFormType>({
    resolver: zodResolver(newMeeting),
    defaultValues: {
      participants: [],
      pautas: [],
    },

    mode: "onChange"
  });

  const queryClient = useQueryClient()

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

  const filteredParticipants =
    query === ""
      ? participants // Mostra todos os participantes ao abrir
      : participants?.filter((participant) =>
        participant.name.toLowerCase().includes(query.toLowerCase())
      );




  function handleAddPautas() {
    const agendaName = watch("meetingAgendaName");
    const agendaTypeId = watch("meetingAgendaTypeId");

    if (!agendaName || !agendaTypeId) {
      toast.warning("Informe o titulo e o tipo da pauta.")
      return;
    };

    const agendaObj = {
      name: agendaName,
      agendaTypeId: agendaTypeId,
    };

    setSelectedPautasAdd((prev) => {
      const updatedPautas = [...prev, agendaObj];
      setValue("pautas", updatedPautas); // Atualiza no React Hook Form
      return updatedPautas;
    });
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
      agendas: selectedPautasAdd,
      projectPhaseId: projectPhaseId,
    };
    await createMeetingFn(meetData);
    queryClient.invalidateQueries({ queryKey: ["get-phase-by-id"] })
    toast.success("Reunião criada com sucesso!");
    onClose()
  }

  const handleSelectParticipant = (participant: User) => {
    setSelectedParticipants((prev) => {
      let updatedParticipants;

      if (prev.some((p) => p.id === participant.id)) {
        updatedParticipants = prev.filter((p) => p.id !== participant.id);
      } else {
        updatedParticipants = [...prev, participant];
      }

      setValue("participants", updatedParticipants);
      return updatedParticipants;
    });

    setQuery("");
    setOpen(false);
  };

  console.log(filteredParticipants)


  const handleRemoveParticipant = (id: string) => {
    setSelectedParticipants((prev) => prev.filter((participant) => participant.id !== id));
  };

  function handleDeletePauta(id: string) {
    setSelectedPautasAdd((prev) => prev.filter((pauta) => pauta.agendaTypeId !== id))
  }

  console.log(selectedParticipants)

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
          <div >
            <Label className="text-sm font-medium">Titulo da reunião</Label>
            <Input
              required
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

                  required
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full bg-transparent">
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
                required
                type="date"
                {...register("meetingDate")}
                placeholder="Data"
                className="bg-transparent placeholder:text-gray-500 focus:border-none w-full"
                min={new Date().toISOString().split("T")[0]}
              />

            </div>
          </div>
          <div className="w-full flex items-center justify-between gap-4">
            <div className="w-[45%]">
              <Label className="text-sm font-medium">Horário de Início</Label>
              <Input
                required
                type="time"
                {...register("meetingHourStart")}
                placeholder="10:00"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />

            </div>
            <div className="w-1/2">
              <Label className="text-sm font-medium">
                Horário de encerramento
              </Label>
              <Input
                required
                type="time"
                {...register("meetingHourFinish")}
                placeholder="11:00"
                className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
              />

            </div>


          </div>
          <div>
            <Label className="text-sm font-medium ">Moderador</Label>
            <Input
              required
              {...register("moderator")}
              placeholder="John Doe"
              className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
            />

            <div className="w-full">
              <label className="text-sm font-medium">Participantes</label>

              <Popover open={isOpen} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={isOpen} className="w-full justify-between">
                    Selecione um participante
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[500px] z-50 mt-1 p-0 border border-black bg-gray-200 shadow-lg rounded-md">
                  <Command>
                    <CommandInput placeholder="Digite para buscar..." value={query} onValueChange={setQuery} />
                    <CommandList>
                      {filteredParticipants?.map((participant) => (
                        <CommandItem
                        className="cursor-pointer hover:bg-gray-50"
                          key={participant.id}
                          value={participant.name}
                          onSelect={() => {
                            handleSelectParticipant(participant);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 
                              }`}
                          />
                          {participant.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Pautas</Label>
            <div className="flex gap-3">
              <Input
                required
                {...register("meetingAgendaName")}
                placeholder="Titulo da pauta"
                className=" bg-transparent"
              />
              <Controller
                name="meetingAgendaTypeId"
                control={control}
                render={({ field }) => (
                  <Select
                    required
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full  bg-transparent">
                      <SelectValue placeholder="Selecione uma pauta" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-100">
                      {pautas?.map((agenda) => {
                        return (
                          <SelectItem key={agenda.id} value={agenda.id}>
                            {agenda.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                )}
              />

              <Button type="button" onClick={() => handleAddPautas()} className="text-white bg-black">Adicionar</Button>
            </div>
            {
              errors?.pautas && (
                <Label className="text-sm text-red-500">{errors.pautas.message}</Label>
              )
            }
          </div>
          {
            selectedPautasAdd?.map((pautaAdd) => {
              return (
                <ul className="bg-green-300 max-w-52 rounded-md px-2 py-1" key={pautaAdd.name}>
                  <li className="flex gap-2 justify-center items-center">{pautaAdd.name}
                    <button onClick={() => handleDeletePauta(pautaAdd.agendaTypeId)}>
                      <X className="text-red-500" />
                    </button>
                  </li>

                </ul>
              )
            })
          }
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
    </div >
  );
}
