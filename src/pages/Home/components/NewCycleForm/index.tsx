import {
  FormContainer,
  TaskInput,
  MinutesAmountInput,
  CounterButton,
  NumberInputWrapper,
  RecurrenceWrapper,
  CheckboxInput,
  OcurrencesAmountInput,
} from "./styles";
import { useContext } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { Plus, Minus } from "phosphor-react";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { control, register, watch } = useFormContext();
  
  const isRecurringCycleSelected = watch('selectedRecurringCycleId');
  
  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle || !!isRecurringCycleSelected}
        {...register("task")}
      />

      <label htmlFor="minutesAmount">durante</label>
      <NumberInputWrapper>
        <Controller
          control={control}
          name="minutesAmount"
          render={({ field: { onChange, value } }) => (
            <>
              <CounterButton
                type="button"
                aria-label="Diminuir tempo"
                onClick={() => {
                  // Evita valor negativo
                  if (value > 0) onChange(Number(value) - 1);
                }}
                disabled={!!activeCycle || !!isRecurringCycleSelected}
              >
                <Minus size={16} />
              </CounterButton>
              <MinutesAmountInput
                type="number"
                id="minutesAmount"
                placeholder="00"
                disabled={!!activeCycle || !!isRecurringCycleSelected}
                value={value}
                onChange={(e) => {
                  // Permite somente dois dígitos numéricos
                  const newValue = e.target.value;
                  if (/^\d{0,2}$/.test(newValue)) {
                    onChange(Number(newValue));
                  }
                }}
              />
              <CounterButton
                type="button"
                aria-label="Aumentar tempo"
                onClick={() => {
                  // Limite superior: 99
                  if (value < 60) onChange(Number(value) + 1);
                }}
                disabled={!!activeCycle || !!isRecurringCycleSelected}
              >
                <Plus size={16} />
              </CounterButton>
            </>
          )}
        />
      </NumberInputWrapper>
      <span>minutos.</span>
      <RecurrenceWrapper>
        <Controller
          control={control}
          name="isRecurring"
          render={({ field: { onChange, value } }) => (
            <>
              <label htmlFor="isRecurring">Tarefa recorrente?</label>
              <CheckboxInput
                type="checkbox"
                id="isRecurring"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                disabled={!!activeCycle || !!isRecurringCycleSelected}
              />

              {value && (
                <>
                  <label htmlFor="recurrenceCount" style={{ marginRight: '0.5rem' }}>Quantas vezes:</label>
                  <Controller
                    control={control}
                    name="recurrenceCount"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <NumberInputWrapper>
                          <CounterButton
                            type="button"
                            aria-label="Diminuir tempo"
                            onClick={() => {
                              // Evita valor negativo
                              if (value > 2) onChange(Number(value) - 1);
                            }}
                            disabled={!!activeCycle || !!isRecurringCycleSelected}
                          >
                            <Minus size={16} />
                          </CounterButton>
                          <OcurrencesAmountInput
                            type="number"
                            id="recurrenceCount"
                            min="2"
                            max="7"
                            value={value}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (/^\d{0,1}$/.test(newValue)) {
                                onChange(Number(newValue));
                              }
                            }}
                            disabled={!!activeCycle || !!isRecurringCycleSelected}
                          />
                          <CounterButton
                            type="button"
                            aria-label="Aumentar tempo"
                            onClick={() => {
                              if (value < 7) onChange(Number(value) + 1);
                            }}
                            disabled={!!activeCycle || !!isRecurringCycleSelected}
                          >
                            <Plus size={16} />
                          </CounterButton>
                        </NumberInputWrapper>
                      </>
                    )}
                  />
                </>
              )}
            </>
          )}
        />
      </RecurrenceWrapper>
    </FormContainer>
  );
}
