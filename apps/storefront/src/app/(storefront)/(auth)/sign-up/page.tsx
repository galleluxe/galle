"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpAction } from "@/features/auth/server/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Display, BodyText, Eyebrow } from "@/components/typography/display";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Include one uppercase letter")
    .regex(/[0-9]/, "Include one number"),
});

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
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
      const result = await signUpAction({
        email: data.email,
        password: data.password,
      });
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
        <Eyebrow className="text-center mb-4">Begin your journey</Eyebrow>
        <Display className="text-display-md-mobile text-center mb-4">
          Create Account
        </Display>
        <BodyText className="text-center mb-8 text-on-surface-variant">
          Email and password only — add your name later in account settings.
        </BodyText>

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
              autoComplete="new-password"
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
            {pending ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <BodyText>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </BodyText>
        </div>
      </div>
    </div>
  );
}
