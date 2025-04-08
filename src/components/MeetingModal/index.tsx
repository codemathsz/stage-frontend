import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import {
  CircleArrowRight,
  CircleUserRound,
  MoveRight,
  SquareChartGantt,
  UserRound,
  X,
} from "lucide-react";
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
import { useEffect, useRef, useState } from "react";
import { MeetType, User } from "@/types";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import {
  updateMeetingApi,
  UpdateMeetingParams,
} from "@/api/meet-api/update-meeting";

interface MeetingModalProps {
  isOpen?: boolean;
  onClose: () => void;
  projectPhaseId: string;
  updateMeetingData?: MeetType;
}

const newMeeting = z.object({
  title: z.string().min(1, "Informe o titulo da reunião."),
  meetingType: z.string().min(1, "Informe o Objetivo da reunião."),
  meetingDate: z.string().min(1, "Informe a data da reunião."),
  meetingHourFinish: z.string().min(1, "Informe a hora de fim da reunião."),
  meetingHourStart: z.string().min(1, "Informe a hora de inicio da reunião."),
  moderator: z.string().min(1, "Informe o moderador da reunião."),
  meetingAgendaName: z.string().optional(),
  meetingAgendaTypeId: z.string().optional(),
  participants: z
    .array(
      z.object({
        id: z.string(),
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
    .min(1, "Adicione pelo menos uma pauta"),
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
    id?: string;
    name: string;
    agendaTypeId: string;
  }[];
  projectPhaseId: string;
}

type NewMeetingFormType = z.infer<typeof newMeeting>;

type AgendaObject = {
  name: string;
  agendaTypeId: string;
};
type AgendaObjectUpdate = {
  id: string;
  name: string;
  agendaTypeId: string;
};

export function MeetingModal({
  onClose,
  projectPhaseId,
  updateMeetingData,
  isOpen,
}: MeetingModalProps) {
  const [focus, setFocus] = useState(false);
  const [blurTimeout, setBlurTimeout] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [selectedPautasAdd, setSelectedPautasAdd] = useState<AgendaObject[]>(
    []
  );
  const [selectedPautasUpdate, setSelectedPautasUpdate] = useState<
    AgendaObjectUpdate[]
  >([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<NewMeetingFormType>({
    resolver: zodResolver(newMeeting),
    mode: "onChange",
    defaultValues: {
      meetingType: "",
      meetingAgendaTypeId: "",
    },
  });

  console.log(errors);

  // Atualiza os valores do formulário quando updateMeetingData e a modal estiver aberta
  useEffect(() => {
    if (isOpen && updateMeetingData) {
      setValue("participants", updateMeetingData.participants || []);
      setValue("pautas", updateMeetingData.agendas || []);
      setValue("title", updateMeetingData.title || "");
      setValue("moderator", updateMeetingData.moderator || "");
      setValue("meetingDate", updateMeetingData.meetDate || "");
      setValue("meetingHourFinish", updateMeetingData.meetTimeFinish || "");
      setValue("meetingHourStart", updateMeetingData.meetTimeStart || "");
      setValue("meetingType", String(updateMeetingData.meetObjectiveId || ""));
      setValue("pautas", updateMeetingData.agendas);
      setSelectedParticipants(updateMeetingData.participants || []);
      setSelectedPautasUpdate(updateMeetingData.agendas || []);
    }
  }, [isOpen, updateMeetingData, setValue]);

  const queryClient = useQueryClient();

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

  const { mutateAsync: updateMeetingFn } = useMutation({
    mutationFn: ({ meet, id }: UpdateMeetingParams) =>
      updateMeetingApi({ meet, id }),
  });

  function handleAddPautas() {
    const agendaName = watch("meetingAgendaName");
    const agendaTypeId = watch("meetingAgendaTypeId");

    // Validação para campos obrigatórios no modo de criação
    if (!updateMeetingData) {
      let hasError = false;

      if (!agendaName) {
        setError("meetingAgendaName", {
          type: "custom",
          message: "Informe o nome",
        });
        hasError = true;
      }

      if (!agendaTypeId) {
        setError("meetingAgendaTypeId", {
          type: "custom",
          message: "Informe o tipo da pauta",
        });
        hasError = true;
      }

      if (hasError) return;

      const agendaObj = {
        name: agendaName,
        agendaTypeId,
      };

      setSelectedPautasAdd((prev) => {
        const alreadyExists = prev.some((p) => p.agendaTypeId === agendaTypeId);
        if (alreadyExists) return prev;
        const updatedPautas = [...prev, agendaObj];
        setValue("pautas", updatedPautas);
        return updatedPautas;
      });

      return;
    }

    const pautaEncontrada = updateMeetingData.agendas.find(
      (agenda) => agenda.agendaTypeId === agendaTypeId
    );

    const agendaObj = {
      id: pautaEncontrada?.id,
      name: pautaEncontrada?.name || agendaName,
      agendaTypeId: pautaEncontrada?.agendaTypeId || agendaTypeId,
    };

    setSelectedPautasUpdate((prev) => {
      const alreadyExists = prev.some(
        (p) => p.agendaTypeId === agendaObj.agendaTypeId
      );

      if (alreadyExists) return prev;

      const updatedPautas = [...prev, agendaObj];
      setValue("pautas", updatedPautas);
      return updatedPautas;
    });
  }

  async function handleCreateAndUpdateMeeting(data: NewMeetingFormType) {
    if (updateMeetingData) {
      const updateData = {
        title: data.title,
        meetObjectiveId: data.meetingType,
        meetDate: data.meetingDate,
        meetTimeStart: data.meetingHourStart,
        meetTimeFinish: data.meetingHourFinish,
        moderator: data.moderator,
        participants: selectedParticipants.map((p) => p.id),
        agendas: selectedPautasUpdate.map((pautasUpdate) => ({
          id: pautasUpdate.id,
          name: pautasUpdate.name,
          agendaTypeId: pautasUpdate.agendaTypeId,
        })),
        projectPhaseId: projectPhaseId,
      };
      await updateMeetingFn({ meet: updateData, id: updateMeetingData.id });
      queryClient.invalidateQueries({ queryKey: ["get-phase-by-id"] });
      toast.success("Reunião atualizada com sucesso!");
      onClose();
    } else {
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
      queryClient.invalidateQueries({ queryKey: ["get-phase-by-id"] });
      toast.success("Reunião criada com sucesso!");
      onClose();
    }
  }

  function handleSelectParticipant(participant: User) {
    setSelectedParticipants((prev) => {
      let updatedParticipants;

      if (prev.some((p) => p.id === participant.id)) {
        updatedParticipants = prev.filter((p) => p.id !== participant.id);
      } else {
        updatedParticipants = [...prev, participant];
        setFocus(false);
      }

      setValue("participants", updatedParticipants);
      return updatedParticipants;
    });
    setQuery("");
    inputRef.current?.blur();
  }

  function handleRemoveParticipant(id: string) {
    setSelectedParticipants((prev) =>
      prev.filter((participant) => participant.id !== id)
    );
  }

  function handleDeletePauta(id: string) {
    if (updateMeetingData) {
      setSelectedPautasUpdate((prev) =>
        prev.filter((pauta) => pauta.agendaTypeId !== id)
      );
    } else {
      setSelectedPautasAdd((prev) =>
        prev.filter((pauta) => pauta.agendaTypeId !== id)
      );
      setValue("pautas", []);
    }
  }

  const filteredParticipants =
    query === ""
      ? participants
      : participants?.filter((participant) =>
          participant.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-screen bg-black bg-opacity-50 z-50">
      <div className="w-2/4 max-w-[45.9rem] bg-white flex flex-col gap-4 rounded-lg shadow-sm p-6 font-poppins">
        <div className="w-full flex justify-between">
          {updateMeetingData ? (
            <h2 className="text-2xl font-semibold">Editar reunião</h2>
          ) : (
            <h2 className="text-2xl font-semibold">Criar reunião</h2>
          )}
          <X size={18} className="cursor-pointer" onClick={onClose} />
        </div>
        <form
          onSubmit={handleSubmit(handleCreateAndUpdateMeeting)}
          className="w-full flex flex-col gap-4"
        >
          <div>
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
            {meetingObjectives && (
              <Controller
                key={`${
                  updateMeetingData?.meetObjectiveId || "default"
                }-${isOpen}`}
                name="meetingType"
                control={control}
                defaultValue={String(updateMeetingData?.meetObjectiveId || "")}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingObjectives.map((objective) => (
                        <SelectItem
                          key={objective.id}
                          value={String(objective.id)}
                        >
                          {objective.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </div>
          <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full">
              <Label className="text-sm font-medium">Data da reunião</Label>
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
            <Label className="text-sm font-medium">Moderador</Label>
            <Input
              required
              {...register("moderator")}
              placeholder="John Doe"
              className="bg-transparent placeholder:text-gray-500 focus:border-none col-span-3"
            />

            <div className="w-full mt-3">
              <Label className="text-sm font-medium">Participantes</Label>
              <Command className="border">
                <CommandInput
                  ref={inputRef}
                  placeholder="Digite para buscar um participante"
                  value={query}
                  onFocus={() => setFocus(true)}
                  onValueChange={setQuery}
                  onBlur={() => {
                    setBlurTimeout(
                      window.setTimeout(() => setFocus(false), 200)
                    );
                  }}
                />
                {focus &&
                  filteredParticipants &&
                  filteredParticipants.length > 0 && (
                    <CommandList
                      onMouseDown={(e) => e.preventDefault()}
                      className="bg-gray-100 border rounded-b-md shadow-md"
                    >
                      {filteredParticipants.map((participant) => (
                        <CommandItem
                          className="cursor-pointer hover:bg-gray-50"
                          key={participant.id}
                          value={participant.name}
                          onMouseDown={() => {
                            if (blurTimeout) clearTimeout(blurTimeout);
                          }}
                          onSelect={() => {
                            handleSelectParticipant(participant);
                            setQuery("");
                            setFocus(false);
                          }}
                        >
                          <UserRound className="mr-2 h-4 w-4" />
                          {participant.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  )}
              </Command>

              {errors.participants?.message && (
                <Label className="text-sm text-red-500">
                  {errors.participants?.message}
                </Label>
              )}

              {selectedParticipants && selectedParticipants.length > 0 && (
                <h2 className="mt-2 font-medium">
                  Participantes selecionados:
                </h2>
              )}
              <div className="w-full flex gap-2 flex-wrap">
                {selectedParticipants?.map((participant) => (
                  <div
                    className="flex items-center gap-2 bg-gray-200 p-2 rounded w-auto"
                    key={participant.id}
                  >
                    <CircleUserRound className="text-blue-700" size={20} />
                    <li className="list-none font-medium">
                      {participant.name}
                    </li>
                    <button
                      className="flex"
                      type="button"
                      onClick={() => handleRemoveParticipant(participant.id)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Label className="text-sm font-medium">Adicionar pautas</Label>
            <div className="flex gap-3">
              <Input
                required={!updateMeetingData}
                {...register("meetingAgendaName")}
                placeholder="Titulo da pauta"
                className="bg-transparent"
              />
              <Controller
                name="meetingAgendaTypeId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma pauta" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-100">
                      {pautas?.map((agenda) => (
                        <SelectItem key={agenda.id} value={agenda.id}>
                          {agenda.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Button
                type="button"
                onClick={handleAddPautas}
                className="text-white bg-black"
              >
                Adicionar
              </Button>
            </div>
            {errors?.pautas?.message && (
              <Label className="text-sm text-center text-red-500">
                {errors.pautas.message}
              </Label>
            )}
          </div>
          {selectedPautasAdd?.map((pautaAdd) => (
            <ul
              className="bg-gray-200 max-w-52 rounded-md px-2 py-1"
              key={pautaAdd.name}
            >
              <li className="w-full flex gap-2 justify-between items-center font-medium">
                <SquareChartGantt className="text-blue-600" size={20} />
                {pautaAdd.name}
                <button
                  title="Remover"
                  onClick={() => handleDeletePauta(pautaAdd.agendaTypeId)}
                >
                  <X />
                </button>
              </li>
            </ul>
          ))}
          {selectedPautasUpdate?.map((pautaUpdate) => (
            <ul
              className="bg-gray-200 max-w-52 rounded-md px-2 py-1"
              key={pautaUpdate.id}
            >
              <li className="flex gap-2 justify-center items-center font-medium">
                <CircleArrowRight size={20} />
                {pautaUpdate.name}
                <button
                  title="Remover"
                  onClick={() => handleDeletePauta(pautaUpdate.agendaTypeId)}
                >
                  <X />
                </button>
              </li>
            </ul>
          ))}
          <div className="w-full flex justify-end gap-2">
            <Button
              className="flex gap-2 items-center rounded-md border hover:bg-gray-200 border-gray-200 bg-white px-4 py-2"
              onClick={onClose}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex gap-2 items-center rounded-md border bg-black text-white px-4 py-2"
            >
              {updateMeetingData ? "Editar reunião" : "Criar reunião"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
