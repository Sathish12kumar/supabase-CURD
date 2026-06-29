import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Signin from "./component/Signin.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
        }}
      />
      <Routes>
        <Route index element={<App />} />
        <Route path="/signup" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
