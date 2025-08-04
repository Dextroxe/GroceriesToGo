import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./router/Router.tsx";
import AppWrapper from "./layout/AppWrapper/AppWrapper.tsx";
import { Provider } from "react-redux";
import store from "./store/index.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AppWrapper>
      <Router />
    </AppWrapper>
  </Provider>
);
