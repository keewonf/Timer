import styled, { css } from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonContainerProps {
  variant: ButtonVariant;
}

const buttonVariants = {
  primary: 'purple',
  secondary: 'orange',
  danger: 'red',
  success: 'green',
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 30px;
  border-radius: 4px;
  border: 0;
  margin: 8px;

  background-color: ${({ theme }) => theme['green-500']};
  color: ${({ theme}) => theme.white}


 /* ${props => {
    return css`
      background-color: ${buttonVariants[props.variant]}
    `
  }} */
`




