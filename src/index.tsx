import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { Login } from "./app/login"
import { Dashboard } from "./app/dashboard"
import { Users } from "./app/dashboard/routes/users"
import "./index.css"
import { Session } from "./routes/session"
import { AuthProvider } from "./providers/auth"

if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark')

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  document.documentElement.classList.toggle('dark', e.matches)
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Routes>
            <Route path="login" element={<Login />} />
            <Route element={<Session />}>
              <Route path="/" element={<Dashboard />}>
                <Route path="users" element={<Users />} />
              </Route>
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)