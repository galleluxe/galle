"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trackOrderAction } from "@/features/account/server/actions";
import { PageShell } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Display, BodyText, Eyebrow, Headline } from "@/components/typography/display";
import { formatINR } from "@/lib/money";

const schema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function TrackPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null);
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
      if (res.success) setResult(res.data);
      else setServerError(res.error);
    });
  };

  return (
    <PageShell className="pt-4 md:pt-8 pb-12 md:pb-section-gap max-w-xl mx-auto">
      <div className={result ? "hidden" : "block"}>
        <Display className="text-display-lg-mobile mb-4 text-center">Sign In to Track</Display>
        <BodyText className="text-center mb-10 text-on-surface-variant/90 max-w-md mx-auto text-sm md:text-base">
          To protect your privacy, please sign in using the unique **Order ID** and **Email Address** associated with your purchase.
        </BodyText>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 sm:p-8 ambient-shadow" noValidate>
          <div>
            <Input {...register("orderId")} label="Order ID / Order Number" placeholder="GALLE-XXXXXX" aria-invalid={!!errors.orderId} />
            {errors.orderId && <p className="mt-1 text-error text-xs">{errors.orderId.message}</p>}
          </div>
          <div>
            <Input {...register("email")} type="email" label="Billing Email Address" placeholder="you@example.com" aria-invalid={!!errors.email} />
            {errors.email && <p className="mt-1 text-error text-xs">{errors.email.message}</p>}
          </div>

          {serverError && <p className="text-error text-sm text-center">{serverError}</p>}

          <Button type="submit" variant="primary" className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest" disabled={pending}>
            {pending ? "Authenticating…" : "Sign In & Track"}
          </Button>
        </form>
      </div>

      {result && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="border-b border-outline-variant/30 pb-6">
            <button
              onClick={() => setResult(null)}
              className="text-xs font-label-caps text-secondary uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1 mb-4"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Track Form
            </button>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <Headline>Order #{String(result.display_id ?? result.id)}</Headline>
              <span className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold bg-primary-container/15 text-primary">
                {String(result.fulfillment_status ?? result.status ?? "Paid")}
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant/80 mt-1">
              Placed on {result.created_at ? new Date(result.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }) : "—"}
            </p>
          </div>

          {/* Shipment Progress Timeline */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
            <p className="font-label-caps text-[10px] text-outline uppercase tracking-widest">
              Delivery Progress
            </p>
            <div className="relative pl-6 border-l border-outline-variant/40 space-y-6 py-2">
              <div className="relative">
                <span className="absolute -left-[30px] top-0 bg-primary text-surface h-4 w-4 rounded-full flex items-center justify-center border-4 border-surface ring-1 ring-primary"></span>
                <p className="font-headline-sm text-sm text-primary">Order Placed & Confirmed</p>
                <p className="font-body-sm text-xs text-on-surface-variant">Payment has been securely processed.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0 bg-surface-container border border-outline-variant h-4 w-4 rounded-full flex items-center justify-center border-4"></span>
                <p className="font-headline-sm text-sm text-on-surface-variant">Preparing for Dispatch</p>
                <p className="font-body-sm text-xs text-on-surface-variant/60">Our perfume atelier is carefully packing your essences.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0 bg-surface-container border border-outline-variant h-4 w-4 rounded-full flex items-center justify-center border-4"></span>
                <p className="font-headline-sm text-sm text-on-surface-variant/50">Shipped with Shiprocket</p>
                <p className="font-body-sm text-xs text-on-surface-variant/40">A tracking code will be shared once dispatched.</p>
              </div>
            </div>
          </div>

          {/* Purchased Essences */}
          <div className="space-y-4">
            <p className="font-label-caps text-xs text-outline uppercase tracking-widest border-b border-outline-variant/30 pb-2">
              Purchased Essences
            </p>
            <ul className="divide-y divide-outline-variant/20">
              {(result.items || []).map((item: any) => (
                <li key={item.id} className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <p className="font-headline-sm text-sm text-primary">{item.title}</p>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                      Qty: {item.quantity} · {formatINR(item.unit_price)} each
                    </p>
                  </div>
                  <p className="font-headline-sm text-sm text-primary tabular-nums">
                    {formatINR(item.unit_price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-3">
            <div className="flex justify-between font-body-md text-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatINR(result.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between font-body-md text-sm text-on-surface-variant">
              <span>GST portion (18% inclusive)</span>
              <span className="tabular-nums">{formatINR(result.tax_total || 0)}</span>
            </div>
            <div className="flex justify-between font-body-md text-sm text-on-surface-variant">
              <span>Shipping (Free)</span>
              <span className="tabular-nums">{formatINR(0)}</span>
            </div>
            <div className="flex justify-between font-headline-sm text-base text-primary border-t border-outline-variant/30 pt-3">
              <span>Total Paid</span>
              <span className="tabular-nums">{formatINR(result.total || 0)}</span>
            </div>
          </div>

          {/* Shipping address */}
          {result.shipping_address && (
            <div className="space-y-3">
              <p className="font-label-caps text-xs text-outline uppercase tracking-widest border-b border-outline-variant/30 pb-2">
                Delivery Destination
              </p>
              <div className="font-body-md text-sm text-on-surface space-y-1">
                <p className="font-semibold text-primary">
                  {result.shipping_address.first_name} {result.shipping_address.last_name}
                </p>
                <p>{result.shipping_address.address_1}</p>
                <p>
                  {result.shipping_address.city}, {result.shipping_address.province || ""} {result.shipping_address.postal_code}
                </p>
                {result.shipping_address.phone && (
                  <p className="text-on-surface-variant text-xs mt-2">Phone: {result.shipping_address.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
