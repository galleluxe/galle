"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { completeOrderAction } from "../server/actions";
import type { Cart } from "@/lib/catalog/types";
import { formatINR } from "@/lib/money";

interface CheckoutFormProps {
  cart: Cart;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Razorpay script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay"));
    document.body.appendChild(script);
  });
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "paying">("form");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const finishOrder = useCallback(
    async (razorpayPaymentId: string) => {
      try {
        const result = await completeOrderAction({
          ...form,
          razorpayPaymentId,
        });

        if (result?.success) {
          router.push("/checkout/success");
          return;
        }
        setError("Something went wrong placing your order. Please try again.");
      } catch (err) {
        console.error(err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
        setStep("form");
      }
    },
    [form, router],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key) {
      setError("Payment is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to your environment.");
      return;
    }

    if (cart.subtotalPaise < 100) {
      setError("Cart total is too low to process payment.");
      return;
    }

    setLoading(true);
    setStep("paying");

    try {
      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key,
        amount: cart.subtotalPaise,
        currency: "INR",
        name: "GALLE",
        description: "GALLE fragrance order",
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#6F5959" },
        handler: (response) => {
          void finishOrder(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStep("form");
          },
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
        setStep("form");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Could not open Razorpay checkout. Please try again.");
      setLoading(false);
      setStep("form");
    }
  };

  return (
    <div className="relative">
      {step === "paying" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-surface/90 border border-outline-variant/30 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-[0_20px_50px_rgba(111,89,89,0.15)] text-center space-y-6">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin block mx-auto">
              progress_activity
            </span>
            <p className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest">
              Razorpay Secure
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Complete payment in the popup for {formatINR(cart.subtotalPaise)}…
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="font-headline-sm text-headline-sm text-primary mb-6 uppercase tracking-widest">
            Shipping Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="First name" name="firstName" value={form.firstName} onChange={handleChange} required />
            <Input label="Last name" name="lastName" value={form.lastName} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required className="sm:col-span-2" />
            <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required className="sm:col-span-2" />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} required className="sm:col-span-2" />
            <Input label="City" name="city" value={form.city} onChange={handleChange} required />
            <Input label="PIN code" name="postalCode" value={form.postalCode} onChange={handleChange} required />
            <Input label="State" name="province" value={form.province} onChange={handleChange} required className="sm:col-span-2" />
          </div>
        </section>

        <section className="border-t border-outline-variant/30 pt-8">
          <div className="flex justify-between items-baseline mb-2">
            <p className="font-headline-md text-headline-md text-primary uppercase tracking-widest">Total</p>
            <p className="font-headline-md text-headline-md text-primary tabular-nums">
              {formatINR(cart.subtotalPaise)}
            </p>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Free shipping. Payment secured via Razorpay (test mode when using test keys).
          </p>
          {error && <p className="text-error text-sm mb-4 text-center">{error}</p>}
          <Button type="submit" variant="primary" className="w-full py-4 text-center" disabled={loading}>
            {loading ? "Opening Razorpay…" : "Pay with Razorpay"}
          </Button>
        </section>
      </form>
    </div>
  );
}
