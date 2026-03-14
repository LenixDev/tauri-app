import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { Login } from "@/app/login"
import "@/index.css"
import { App } from "@/app"
import { AuthProvider } from "@/providers/auth"
import "@/locales"
import { DirectionProvider } from "./components/ui/direction"
import { ROUTES } from "./lib/routes"

if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark')

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  document.documentElement.classList.toggle('dark', event.matches)
})

const root = () => {
  const element = document.getElementById("root")
  if (!element) throw new Error("Root element not found")
  return element
}

ReactDOM.createRoot(root()).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DirectionProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="login" element={<Login />} />
              <Route element={<App />}>
                <Route path={ROUTES.dashboard.route} element={ROUTES.dashboard.element()}>
                  <Route path={ROUTES.users.route} element={ROUTES.users.element()} />
                </Route>
              </Route>
            </Routes>
          </TooltipProvider>
        </DirectionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)