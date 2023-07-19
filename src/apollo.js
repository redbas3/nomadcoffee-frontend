import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import routes from "./routes";
import * as jose from "jose";
import { createUploadLink } from "apollo-upload-client";

const TOKEN = "TOKEN";
const DARK_MODE = "DARK_MODE";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const currentUserIDVar = makeVar("");

if (localStorage.getItem(TOKEN)) {
  const { id } = jose.decodeJwt(localStorage.getItem(TOKEN));
  if (id) {
    currentUserIDVar(id);
  }
}

export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};
export const logUserOut = (navigate) => {
  localStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  navigate(routes.home, { replace: true });
};

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};
export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

export const currentPageVar = makeVar(1);

const httpLink = createUploadLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: localStorage.getItem(TOKEN),
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
