import { HandPalm, Play } from "phosphor-react";
import { useForm, FieldErrors, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from "react";

import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1, 'O ciclo precisa ser de no mínimo 1 minuto').max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){
  const {activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
          task: '',
          minutesAmount: 0,
        }
      })

  const { handleSubmit, watch, reset} = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData){
    createNewCycle(data)
    reset()
  }

  function handleFormErrors(errors: FieldErrors<NewCycleFormData>) {
    // Exibe um alert com a mensagem de erro
    if (errors.task) {
      alert(errors.task.message)
    } else if (errors.minutesAmount) {
      alert(errors.minutesAmount.message)
    }
  }


  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle, handleFormErrors)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown  />

        { activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24}/>
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24}/>
            Começar
          </StartCountdownButton >
        ) }
      </form>
    </HomeContainer>
  )
}