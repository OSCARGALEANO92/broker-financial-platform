import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Se mantiene correcto
import { GlobalProvider } from "./context/GlobalContext"; // Importar el contexto
import "./index.css"; // Asegurar que el archivo de estilos está en `src/`
import "./styles.css";
import * as serviceWorker from "./serviceWorker"; // 👈 Importa el Service Worker

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GlobalProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </GlobalProvider>
  </React.StrictMode>
);

serviceWorker.register();










