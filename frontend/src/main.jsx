import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          width: "300px",
          fontSize: "1.2rem",
        },
        success: {
          backgroundColor: "lightgreen",
          color: "white",
        },
        error: {
          backgroundColor: "red",
          color: "white",
        },
      }}
    />
  </>
);
