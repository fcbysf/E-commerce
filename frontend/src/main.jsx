import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Loader from "./layouts/loader.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <Suspense fallback={<div><Loader /></div>}>
    <App />
  </Suspense>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          width: "300px",
          fontSize: "1.2rem",
        },
        success: {
          style: {
            backgroundColor: "lightgreen",
            color: "white",
          },
        },
        error: {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        },
      }}
    />
  </>
);
