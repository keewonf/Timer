import styled from 'styled-components';

export const RecurringCyclesContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${(props) => props.theme['gray-700']};
  
  h4 {
    color: ${(props) => props.theme['gray-100']};
    margin-bottom: 0.75rem;
  }
  
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

interface RecurringCycleItemProps {
  selected: boolean;
}

export const RecurringCycleItem = styled.button<RecurringCycleItemProps>`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${(props) => props.selected ? props.theme['green-500'] : props.theme['gray-600']};
  color: ${(props) => props.theme['gray-100']};
  border: 1px solid ${(props) => props.selected ? props.theme['green-500'] : props.theme['gray-500']};
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: ${(props) => props.selected ? props.theme['green-500'] : props.theme['gray-500']};
  }
`; 