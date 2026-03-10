import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { Login } from "./app/login";
import { Dashboard } from "./app/dashboard";
import "./App.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { Users } from "./app/users";

if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark')

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  document.documentElement.classList.toggle('dark', e.matches)
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Routes>
          {/*TODO:  add an idle logout */}
          <Route path="/" element={<Login />} />
          {/* TODO: redirect to the dashboard instead and check for session tokens */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </React.StrictMode>
);