import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Router from "./router/Router.tsx";
import AppWrapper from "./layout/AppWrapper/AppWrapper.tsx";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import MainPage from "./components/landingPage/mainPage.tsx";
import PublicRoutes from "./router/PublicRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AppWrapper>
      <Router />
    </AppWrapper>
  </Provider>
);
