import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
  fontColor: "rgb(38, 38, 38)",
  bgColor: "#FAFAFA",
  accent: "#0095f6",
  borderColor: "rgb(219, 219, 219)",
};

export const darkTheme = {
  fontColor: "white",
  bgColor: "rgb(38, 38, 38)",
};

export const GlobalStyles = createGlobalStyle`
  ${reset}
  button, input, a { 
    all:unset;
  }
  * {
    box-sizing:border-box;
  }
  body {
    background-color: ${(props) => props.theme.bgColor};
    font-size:14px;
    font-family:'Open Sans', sans-serif;
    color: ${(props) => props.theme.fontColor};
  }
  a {
    text-decoration: none;
  }
`;
