import { produce } from "immer";

import { ActionTypes } from "./actions";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
  isRecurring: boolean;
  recurrenceCount?: number;
  completedRecurrences?: number;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

interface AddNewCycleAction {
  type: ActionTypes.ADD_NEW_CYCLE;
  payload: {
    newCycle: Cycle;
  };
}

interface InterruptCurrentCycleAction {
  type: ActionTypes.INTERRUPT_CURRENT_CYCLE;
}

interface MarkCurrentCycleAsFinishedAction {
  type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED;
}

type ActionType =
  | AddNewCycleAction
  | InterruptCurrentCycleAction
  | MarkCurrentCycleAsFinishedAction;

export function cyclesReducer(state: CyclesState, action: ActionType) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        // Verifica se é um ciclo recorrente existente sendo continuado
        const existingCycleIndex = draft.cycles.findIndex(
          (cycle) => cycle.id === action.payload.newCycle.id
        );

        if (existingCycleIndex >= 0) {
          // Atualiza o ciclo existente
          draft.cycles[existingCycleIndex] = action.payload.newCycle;
        } else {
          // Adiciona um novo ciclo
          draft.cycles.push(action.payload.newCycle);
        }

        draft.activeCycleId = action.payload.newCycle.id;
      });

    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId;
      });

      if (currentCycleIndex < 0) {
        return state;
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].interruptedDate = new Date();
      });
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId;
      });

      if (currentCycleIndex < 0) {
        return state;
      }

      return produce(state, (draft) => {
        const cycle = draft.cycles[currentCycleIndex];

        if (cycle.isRecurring) {
          // Incrementar o contador de recorrências completadas
          cycle.completedRecurrences = (cycle.completedRecurrences || 0) + 1;

          // Verificar se todas as recorrências foram completadas
          if (cycle.completedRecurrences >= (cycle.recurrenceCount || 1)) {
            // Completou todas as recorrências
            cycle.finishedDate = new Date();
          }
        } else {
          // Para ciclos não recorrentes
          cycle.finishedDate = new Date();
        }

        draft.activeCycleId = null;
      });
    }
    default:
      return state;
  }
}
