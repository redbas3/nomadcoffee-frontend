import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, darkTheme, lightTheme } from "./styles";
import SignUp from "./screens/SignUp";
import routes from "./routes";
import { HelmetProvider } from "react-helmet-async";
import Add from "./screens/Add";
import CoffeeShop from "./screens/CoffeeShop";
import EditCoffeeShop from "./screens/EditCoffeeShop";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Routes>
              <Route
                path={routes.home}
                element={isLoggedIn ? <Home /> : <Login />}
              />
              {!isLoggedIn ? (
                <Route path={routes.signUp} element={<SignUp />} />
              ) : null}
              {isLoggedIn ? (
                <Route path={routes.add} element={<Add />} />
              ) : null}
              <Route
                path={`${routes.coffeeShop}/:id`}
                element={<CoffeeShop />}
              />
              {isLoggedIn ? (
                <Route
                  path={`${routes.editCoffeeShop}/:id`}
                  element={<EditCoffeeShop />}
                />
              ) : null}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
