import { styled } from "styled-components";

const SFormError = styled.span`
  color: tomato;
  font-weight: 600;
  font-size: 12px;
  margin: 5px 0 10px;
`;

function FormError({ message }) {
  return message ? <SFormError>{message}</SFormError> : null;
}

export default FormError;
