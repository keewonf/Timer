import styled from 'styled-components'

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme['gray-100']};
  font-size: 1.125rem;
  font-weight: 700;
  flex-wrap: wrap;
`

const BaseInput = styled.input`
  background: transparent;
  height: 2.5rem;
  border: 0;
  border-bottom: 2px solid ${({ theme }) => theme['gray-500']};
  font-weight: 700;
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${({ theme }) => theme['gray-100']};

  &:focus {
    box-shadow: none;
    border-color: ${({ theme }) => theme['green-500']}
  }

  &::placeholder{
    color: ${({ theme }) => theme['gray-500']};
  }
`

export const TaskInput = styled(BaseInput)`
  flex: 1;

  &::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`

export const MinutesInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 2px solid ${({ theme }) => theme['gray-500']};
  width: 4.35rem;
  
`

export const MinutesAmountInput = styled(BaseInput)`
  width: 100%;
  text-align: center;
  border-bottom: none;
  //padding: 0 0.5rem;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  }

  & {
    appearance: none;
    -moz-appearance: textfield;
  }
  appearance: none;
  margin: 0;
`

export const CounterButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  color: ${({ theme }) => theme['gray-500']};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme['green-500']};
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`