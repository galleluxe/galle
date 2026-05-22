interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  console.log("Razorpay Integration Diagnostics:");
  console.log("- RAZORPAY_KEY_ID config exists:", !!process.env.RAZORPAY_KEY_ID);
  console.log("- NEXT_PUBLIC_RAZORPAY_KEY_ID config exists:", !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  console.log("- Resolved Key ID length:", keyId?.length ?? 0);
  console.log("- RAZORPAY_KEY_SECRET config exists:", !!process.env.RAZORPAY_KEY_SECRET);
  console.log("- Resolved Secret length:", keySecret?.length ?? 0);

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not fully configured. Please ensure both Key ID and Key Secret are added to your environment variables.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Razorpay order failed: ${err}`);
  }

  return (await res.json()) as RazorpayOrderResponse;
}
