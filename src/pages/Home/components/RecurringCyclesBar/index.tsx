import { useContext } from 'react';
import { CyclesContext } from '../../../../contexts/CyclesContext';
import { RecurringCyclesContainer, RecurringCycleItem } from './styles';

interface RecurringCyclesBarProps {
  onSelectCycle: (cycleId: string) => void;
  selectedCycleId: string | null;
}

export function RecurringCyclesBar({ onSelectCycle, selectedCycleId }: RecurringCyclesBarProps) {
  const { getAvailableRecurringCycles } = useContext(CyclesContext);
  
  const availableCycles = getAvailableRecurringCycles();
  
  if (availableCycles.length === 0) {
    return null;
  }
  
  return (
    <RecurringCyclesContainer>
      <h4>Ciclos recorrentes em andamento:</h4>
      <div>
        {availableCycles.map(cycle => (
          <RecurringCycleItem 
            key={cycle.id}
            onClick={() => onSelectCycle(cycle.id)}
            selected={selectedCycleId === cycle.id}
          >
            {cycle.task} ({cycle.completedRecurrences || 0}/{cycle.recurrenceCount})
          </RecurringCycleItem>
        ))}
      </div>
    </RecurringCyclesContainer>
  );
} 