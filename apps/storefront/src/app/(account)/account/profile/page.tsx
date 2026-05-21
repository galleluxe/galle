"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfileAction } from "@/features/account/server/actions";
import { PageShell } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Headline, Eyebrow } from "@/components/typography/display";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setSuccess(false);
    setServerError("");
    startTransition(async () => {
      const result = await updateProfileAction({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? "",
      });
      if (result.success) setSuccess(true);
      else setServerError(result.error ?? "Failed to save.");
    });
  };

  return (
    <PageShell className="pt-8 pb-section-gap max-w-md mx-auto">
      <Eyebrow className="mb-4">
        <Link href="/account" className="hover:text-primary">← Account</Link>
      </Eyebrow>
      <Headline className="mb-8">Your Profile</Headline>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <Input {...register("firstName")} label="First name" aria-invalid={!!errors.firstName} />
          {errors.firstName && <p className="mt-1 text-error text-xs">{errors.firstName.message}</p>}
        </div>
        <div>
          <Input {...register("lastName")} label="Last name" aria-invalid={!!errors.lastName} />
          {errors.lastName && <p className="mt-1 text-error text-xs">{errors.lastName.message}</p>}
        </div>
        <div>
          <Input {...register("phone")} label="Phone" type="tel" />
        </div>

        {success && (
          <p className="text-sm text-center" style={{ color: "var(--color-secondary)" }}>
            Profile updated successfully.
          </p>
        )}
        {serverError && <p className="text-error text-sm text-center">{serverError}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </PageShell>
  );
}
