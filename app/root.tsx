import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router"

import type { Route } from "./+types/root"
import { AppearanceProvider } from "~/contexts/appearance-provider"
import { AuthProvider } from "~/contexts/auth-provider"
import { APPEARANCE_INIT_SCRIPT } from "~/lib/appearance-settings"
import "./app.css"

import { TooltipProvider } from "~/components/ui/tooltip"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-font-size="md" data-font-family="inter">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        <TooltipProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </TooltipProvider>
      </body>
    </html>
  )
}

export default function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </AppearanceProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
