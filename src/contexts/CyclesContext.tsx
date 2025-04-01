import {
  createContext,
  ReactNode,
  useState,
  useReducer,
  useEffect,
} from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
  isRecurring?: boolean;
  recurrenceCount?: number;
  selectedRecurringCycleId?: string | null;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
  getAvailableRecurringCycles: () => Cycle[];
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJson = localStorage.getItem(
        "@ignite-timer:cycles-state-1.0.0"
      );

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson);
      }

      return {
        cycles: [],
        activeCycleId: null,
      };
    }
  );

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }

    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stateJSON);
  }, [cyclesState]);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  function createNewCycle(data: CreateCycleData) {
    // Verifica se está continuando um ciclo recorrente ou criando um novo
    if (data.selectedRecurringCycleId) {
      // Busca o ciclo recorrente selecionado
      const selectedCycle = cycles.find(
        (cycle) => cycle.id === data.selectedRecurringCycleId
      );

      if (selectedCycle) {
        // Não precisa criar um novo ciclo, apenas continua o existente
        const updatedCycle: Cycle = {
          ...selectedCycle,
          startDate: new Date(),
        };

        dispatch(addNewCycleAction(updatedCycle));
      }
    } else {
      // Cria um novo ciclo
      const newCycle: Cycle = {
        id: String(new Date().getTime()),
        task: data.task,
        minutesAmount: data.minutesAmount,
        startDate: new Date(),
        isRecurring: data.isRecurring || false,
        recurrenceCount: data.isRecurring ? data.recurrenceCount : undefined,
        completedRecurrences: 0, // Inicializa sempre com 0, mesmo para ciclos não recorrentes
      };

      dispatch(addNewCycleAction(newCycle));
    }

    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  function getAvailableRecurringCycles() {
    // Retorna apenas ciclos recorrentes que não foram finalizados e não foram interrompidos
    return cycles.filter(
      (cycle) =>
        cycle.isRecurring &&
        !cycle.finishedDate &&
        !cycle.interruptedDate &&
        (cycle.completedRecurrences || 0) < (cycle.recurrenceCount || 0)
    );
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        getAvailableRecurringCycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
