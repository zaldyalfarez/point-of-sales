import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { StoreSettingsProvider } from "@/contexts/StoreSettingsContext.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <StoreSettingsProvider>
        <App />
      </StoreSettingsProvider>
    </ThemeProvider>
  </StrictMode>
)
