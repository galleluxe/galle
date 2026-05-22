"use client";

import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vipSignupAction } from "@/features/newsletter/server/actions";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    marketingOptIn: true,
  });

  useEffect(() => {
    // Check if the user has already joined or dismissed the popup recently
    const hasJoined = localStorage.getItem("galle_vip_joined");
    const dismissedAt = localStorage.getItem("galle_vip_dismissed");

    const isDismissedRecently = dismissedAt && Date.now() - Number(dismissedAt) < 24 * 60 * 60 * 1000 * 7; // 7 days

    if (!hasJoined && !isDismissedRecently) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // open after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("galle_vip_dismissed", String(Date.now()));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Format phone to include +91 if not present
    let finalPhone = form.phone.trim();
    if (!finalPhone.startsWith("+91")) {
      // Remove leading 0 if any
      if (finalPhone.startsWith("0")) {
        finalPhone = finalPhone.substring(1);
      }
      finalPhone = `+91${finalPhone}`;
    }

    startTransition(async () => {
      const res = await vipSignupAction({
        ...form,
        phone: finalPhone,
      });

      setStatus(res);

      if (res.success) {
        localStorage.setItem("galle_vip_joined", "true");
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative bg-[#FCFBF9] border border-outline-variant/30 p-8 md:p-10 max-w-md w-full shadow-[0_25px_60px_rgba(111,89,89,0.2)] text-center space-y-6 overflow-hidden rounded-none"
          >
            {/* Elegant close button */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 text-outline hover:text-primary transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Content Header */}
            <div className="space-y-2">
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-[0.25em] block">
                Exclusive Invitation
              </span>
              <h3 className="font-display-lg text-2xl text-primary uppercase tracking-[0.15em] font-medium leading-tight">
                The Maison Club
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                Join our circle to unlock complimentary luxury travel sizes with your first purchase and receive private scent notes.
              </p>
            </div>

            {status?.success ? (
              <div className="py-8 space-y-4 animate-fade-in">
                <span className="material-symbols-outlined text-4xl text-secondary animate-pulse block">
                  check_circle
                </span>
                <p className="font-headline-sm text-base text-primary uppercase tracking-widest leading-relaxed">
                  Welcome to the Atelier
                </p>
                <p className="font-body-md text-sm text-on-surface-variant">
                  {status.message}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="vip-name" className="block font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    id="vip-name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    disabled={isPending}
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 px-4 py-2.5 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none transition-colors rounded-none"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="vip-email" className="block font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="vip-email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={isPending}
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 px-4 py-2.5 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none transition-colors rounded-none"
                  />
                </div>

                {/* Phone & City Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="vip-phone" className="block font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-body-md text-sm text-outline-variant select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        id="vip-phone"
                        name="phone"
                        required
                        pattern="[0-9]{10}"
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setForm((prev) => ({ ...prev, phone: val.slice(0, 10) }));
                        }}
                        placeholder="10 digits"
                        disabled={isPending}
                        className="w-full bg-surface-container-lowest border border-outline-variant/50 pl-11 pr-3 py-2.5 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none transition-colors rounded-none"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label htmlFor="vip-city" className="block font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                      City
                    </label>
                    <input
                      type="text"
                      id="vip-city"
                      name="city"
                      required
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      disabled={isPending}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 px-4 py-2.5 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none transition-colors rounded-none"
                    />
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="vip-marketingOptIn"
                    name="marketingOptIn"
                    checked={form.marketingOptIn}
                    onChange={handleChange}
                    disabled={isPending}
                    className="mt-0.5 w-4 h-4 rounded-none border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 accent-primary cursor-pointer"
                  />
                  <label htmlFor="vip-marketingOptIn" className="font-body-md text-[11px] text-on-surface-variant leading-relaxed cursor-pointer select-none">
                    I agree to receive communications, offers, and scent stories from Maison GALLE.
                  </label>
                </div>

                {status?.success === false && (
                  <p className="text-error text-xs font-body-md">
                    {status.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary text-on-primary py-3 font-label-caps text-[10px] uppercase tracking-[0.2em] hover:bg-primary/95 transition-colors duration-300 disabled:opacity-50 mt-4 rounded-none font-semibold"
                >
                  {isPending ? "Joining..." : "Request Membership"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
