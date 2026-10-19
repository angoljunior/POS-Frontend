import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GalleryVerticalEndIcon, Loader2, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await login(username.trim(), password);

      const requestedPath = location.state?.from;

      // Navigate back to the requested route after login,
      // or to the dashboard if none was requested.
      const destination =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/dashboard";

      navigate(destination, { replace: true });
    } catch (err) {
      const data = err.response?.data;

      setError(
        (!err.response ? "Cannot reach the server. Check your connection and that Django is running." : null) ||
          data?.detail ||
          data?.non_field_errors?.[0] ||
          "Unable to sign in. Please check your credentials.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          {/* Logo and heading */}
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              to="/login"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>

              <span className="sr-only">Nexa POS</span>
            </Link>

            <h1 className="text-xl font-bold">Welcome to Nexa POS.</h1>

            <FieldDescription>
              Sign in to access your POS dashboard.
            </FieldDescription>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Username */}
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>

            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={submitting}
              required
            />
          </Field>

          {/* Password */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={submitting}
                required
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          {/* Submit */}
          <Field>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Field>

          <FieldDescription className="text-center">
            Need an account? Contact your store administrator.
          </FieldDescription>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        By signing in, you agree to our <a href="/terms">Terms of Service</a>{" "}
        and <a href="/privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
