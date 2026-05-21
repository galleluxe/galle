"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInAction } from "@/features/auth/server/actions";
import { GuestCheckoutNotice } from "@/components/auth/guest-checkout-notice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Display, BodyText, Eyebrow } from "@/components/typography/display";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    setServerError("");
    startTransition(async () => {
      const result = await signInAction(data);
      if (result.success) {
        router.push("/account");
        router.refresh();
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Eyebrow className="text-center mb-4">Welcome back</Eyebrow>
        <Display className="text-display-md-mobile text-center mb-6">
          Sign In
        </Display>

        <GuestCheckoutNotice className="mb-8" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <Input
              {...register("email")}
              type="email"
              label="Email"
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-error text-xs">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("password")}
              type="password"
              label="Password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="mt-1 text-error text-xs">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-error text-sm text-center">{serverError}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <Link
            href="/forgot-password"
            className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
          <BodyText>
            New to GALLE?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Create an account
            </Link>
          </BodyText>
        </div>
      </div>
    </div>
  );
}
