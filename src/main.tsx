import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "modern-normalize";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

const App = lazy(() => import("./components/App/App"));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Suspense fallback={null}>
            <App />
          </Suspense>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);