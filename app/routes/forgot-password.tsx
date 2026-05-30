import { useState } from "react"
import { Link } from "react-router"

import { useAuth } from "~/contexts/auth-provider"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { resetPassword } from "~/lib/firebase"

export default function ForgotPassword() {
  const { configured } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!configured) {
      setError("Firebase is not configured. Check your .env file.")
      return
    }

    setSubmitting(true)
    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {success ? (
            <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
              Check your inbox for a password reset link.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={submitting || !configured}
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !configured}
              >
                {submitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <Link
            to="/login"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
