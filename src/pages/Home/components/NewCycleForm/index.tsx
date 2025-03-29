import { FormContainer, TaskInput, MinutesAmountInput, CounterButton, MinutesInputWrapper } from "./styles"
import { useContext } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { CyclesContext } from "../../../../contexts/CyclesContext"
import { Plus, Minus} from 'phosphor-react'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { control, register } = useFormContext()

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
      <MinutesInputWrapper>
      <Controller 
          control={control}
          name="minutesAmount"
          defaultValue={0}
          render={({ field: { onChange, value } }) => (
            <>
              <CounterButton
                type="button"
                aria-label="Diminuir tempo" 
                onClick={() => {
                  // Evita valor negativo
                  if (value > 0) onChange(Number(value) - 1)
                }}
              >
                <Minus size={16} />
              </CounterButton>
              <MinutesAmountInput 
                type='number'
                id='minutesAmount'
                placeholder="00"
                disabled={!!activeCycle}
                value={value}
                onChange={(e) => {
                  // Permite somente dois dígitos numéricos
                  const newValue = e.target.value
                  if (/^\d{0,2}$/.test(newValue)) {
                    onChange(Number(newValue))
                  }
                }}
              />
              <CounterButton
                type="button"
                aria-label="Aumentar tempo" 
                onClick={() => {
                  // Limite superior: 99
                  if (value < 60) onChange(Number(value) + 1)
                }}
              >
                <Plus size={16} />
              </CounterButton>
            </>
          )}
        />
      </MinutesInputWrapper>
         
      <span>minutos.</span>
    </FormContainer>
  )
}