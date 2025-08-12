import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import MyForms from "./pages/myForms";
import FormPreview from "./components/FormPreview";
import Responses from "./components/Responses";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/form/:id' element={<FormPreview />} />
        <Route path='/responses/:id' element={<Responses />} />
        <Route path='/forms' element={<MyForms />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
