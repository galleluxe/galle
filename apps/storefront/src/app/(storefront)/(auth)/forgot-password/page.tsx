"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPasswordAction } from "@/features/auth/server/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Display, BodyText, Eyebrow } from "@/components/typography/display";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setServerError("");
    startTransition(async () => {
      const result = await forgotPasswordAction(data);
      if (result.success) setSent(true);
      else setServerError(result.error);
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Eyebrow className="text-center mb-4">Account recovery</Eyebrow>
        <Display className="text-display-md-mobile text-center mb-10">
          Reset Password
        </Display>

        {sent ? (
          <div className="text-center space-y-4">
            <BodyText>
              If an account exists for that email, a reset link has been sent.
              Check your inbox.
            </BodyText>
            <Link href="/sign-in" className="text-primary hover:underline font-label-caps text-label-caps uppercase tracking-widest">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <Input {...register("email")} type="email" placeholder="Email" aria-invalid={!!errors.email} />
              {errors.email && <p className="mt-1 text-error text-xs">{errors.email.message}</p>}
            </div>
            {serverError && <p className="text-error text-sm text-center">{serverError}</p>}
            <Button type="submit" variant="primary" className="w-full" disabled={pending}>
              {pending ? "Sending…" : "Send Reset Link"}
            </Button>
            <div className="text-center">
              <Link href="/sign-in" className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
