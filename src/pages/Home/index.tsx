import { HandPalm, Play } from "phosphor-react";
import { useForm, FieldErrors, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useContext, useEffect, useState } from "react";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";
import { RecurringCyclesBar } from "./components/RecurringCyclesBar";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "O ciclo precisa ser de no mínimo 1 minuto")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos"),
  isRecurring: zod.boolean().optional(),
  recurrenceCount: zod.number().optional(),
  selectedRecurringCycleId: zod.string().nullable(),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle, cycles } =
    useContext(CyclesContext);
  const [selectedRecurringCycleId, setSelectedRecurringCycleId] = useState<
    string | null
  >(null);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
      isRecurring: false,
      recurrenceCount: 2,
      selectedRecurringCycleId: null,
    },
  });

  const { handleSubmit, watch, reset, setValue } = newCycleForm;

  // Quando seleciona um ciclo recorrente, preenche o formulário com seus dados
  useEffect(() => {
    if (selectedRecurringCycleId) {
      const selectedCycle = cycles.find(
        (cycle) => cycle.id === selectedRecurringCycleId
      );

      if (selectedCycle) {
        setValue("task", selectedCycle.task);
        setValue("minutesAmount", selectedCycle.minutesAmount);
        setValue("isRecurring", selectedCycle.isRecurring);
        setValue("recurrenceCount", selectedCycle.recurrenceCount);
        setValue("selectedRecurringCycleId", selectedCycle.id);
      }
    } else {
      // Limpa o valor quando nenhum ciclo está selecionado
      setValue("selectedRecurringCycleId", null);
    }
  }, [selectedRecurringCycleId, cycles, setValue]);

  function handleSelectRecurringCycle(cycleId: string) {
    // Se já está selecionado, desmarca
    if (selectedRecurringCycleId === cycleId) {
      setSelectedRecurringCycleId(null);
    } else {
      setSelectedRecurringCycleId(cycleId);
    }
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    setSelectedRecurringCycleId(null);
    reset();
  }

  function handleFormErrors(errors: FieldErrors<NewCycleFormData>) {
    // Exibe um alert com a mensagem de erro
    if (errors.task) {
      alert(errors.task.message);
    } else if (errors.minutesAmount) {
      alert(errors.minutesAmount.message);
    }
  }

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <RecurringCyclesBar
        onSelectCycle={handleSelectRecurringCycle}
        selectedCycleId={selectedRecurringCycleId}
      />

      <form
        onSubmit={handleSubmit(handleCreateNewCycle, handleFormErrors)}
        action=""
      >
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
