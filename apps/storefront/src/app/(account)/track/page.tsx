"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trackOrderAction } from "@/features/account/server/actions";
import { PageShell } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Display, BodyText } from "@/components/typography/display";

const schema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function TrackPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setResult(null);
    setServerError("");
    startTransition(async () => {
      const res = await trackOrderAction(data);
      if (res.success) setResult(res.data as Record<string, unknown>);
      else setServerError(res.error);
    });
  };

  return (
    <PageShell className="pt-8 pb-section-gap max-w-md mx-auto">
      <Display className="text-display-lg-mobile mb-6 text-center">Track Order</Display>
      <BodyText className="text-center mb-8">
        Enter your order ID and email to view shipment status.
      </BodyText>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <Input {...register("orderId")} label="Order ID" aria-invalid={!!errors.orderId} />
          {errors.orderId && <p className="mt-1 text-error text-xs">{errors.orderId.message}</p>}
        </div>
        <div>
          <Input {...register("email")} type="email" label="Email" aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-error text-xs">{errors.email.message}</p>}
        </div>

        {serverError && <p className="text-error text-sm text-center">{serverError}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Looking up…" : "Track Order"}
        </Button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-surface-container rounded-xl space-y-3">
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Order #{String(result.display_id ?? "")}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Status:{" "}
            <span className="text-on-surface capitalize">
              {String(result.fulfillment_status ?? result.status ?? "Pending")}
            </span>
          </p>
        </div>
      )}
    </PageShell>
  );
}
