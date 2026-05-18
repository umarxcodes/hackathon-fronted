import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A2235",
            color: "#F0F4FF",
            border: "1px solid #2A3548",
          },
          success: { iconTheme: { primary: "#06D6A0", secondary: "#1A2235" } },
          error: { iconTheme: { primary: "#FF4D6D", secondary: "#1A2235" } },
        }}
      />
    </Provider>
  </React.StrictMode>
);
