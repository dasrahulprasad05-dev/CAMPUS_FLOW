"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-slate-700"
        >
          Email address
        </label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@university.edu"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <a
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </a>
        </div>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={8}
            placeholder="Enter your password"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircle className="size-5 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in to your dashboard"
        )}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        Access is limited to authorized students, parents, teachers, and
        administrators.
      </p>
    </form>
  );
}
