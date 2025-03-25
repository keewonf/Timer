import { FormContainer, TaskInput, MinutesAmountInput, CounterButton } from "./styles"
import { useContext } from "react"
import { useFormContext } from "react-hook-form"
import { CyclesContext } from "../../../../contexts/CyclesContext"
import { Plus, Minus} from 'phosphor-react'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return(
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput 
        id='task'
        list='task-suggestions'
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
        {...register('task')}
      />

      <datalist id='task-suggestions'>
        <option value='Projeto 1'/>
        <option value='Projeto 2'/>
        <option value='Projeto 3'/>
        <option value='Banana'/>
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
        <CounterButton aria-label="Diminuir tempo"> <Minus size={16}/> </CounterButton>
        <MinutesAmountInput 
          type='number'
          id='minutesAmount'
          placeholder="00"
          disabled={!!activeCycle}
          {...register('minutesAmount', {valueAsNumber: true})}
        />
        <CounterButton aria-label="Aumentar tempo"> <Plus size={16}/> </CounterButton>
         
        <span>minutos.</span>
    </FormContainer>
  )
}