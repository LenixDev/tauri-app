import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { Login } from "@/app/login"
import { Dashboard } from "@/app/dashboard"
import { Users } from "@/app/dashboard/routes/users"
import "@/index.css"
import { App } from "@/app"
import { AuthProvider } from "@/providers/auth"
import "@/locales"
import { DirectionProvider } from "./components/ui/direction"
import { RouteDir } from "./types"

if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark')

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  document.documentElement.classList.toggle('dark', e.matches)
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DirectionProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="login" element={<Login />} />
              <Route element={<App />}>
                <Route path={"/" satisfies RouteDir} element={<Dashboard />}>
                  <Route path={"users" satisfies RouteDir} element={<Users />} />
                </Route>
              </Route>
            </Routes>
          </TooltipProvider>
        </DirectionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)