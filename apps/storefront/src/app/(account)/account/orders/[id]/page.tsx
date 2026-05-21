import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Headline, BodyText, Eyebrow } from "@/components/typography/display";
import { getCustomer } from "@/features/auth/server/session";
import { getOrderDetails } from "@/features/account/server/actions";
import { formatINR } from "@/lib/money";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const customer = await getCustomer();

  if (!customer) {
    return (
      <PageShell className="pt-8 pb-section-gap max-w-2xl mx-auto text-center space-y-6">
        <Headline>Access Denied</Headline>
        <BodyText>Please sign in to view this order&apos;s details.</BodyText>
        <Link
          href="/sign-in"
          className="inline-block font-label-caps text-label-caps text-secondary uppercase tracking-widest hover:underline"
        >
          Sign In
        </Link>
      </PageShell>
    );
  }

  const orderResult = await getOrderDetails(id);

  if (!orderResult.success) {
    notFound();
  }

  const order = orderResult.data;
  const displayId = order.display_id ? `#${order.display_id}` : order.id.slice(-8);
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const items = order.items ?? [];
  const shippingAddress = order.shipping_address;
  const status = order.fulfillment_status ?? order.status ?? "pending";

  return (
    <PageShell className="pt-8 pb-section-gap max-w-2xl mx-auto space-y-10">
      <div>
        <Eyebrow className="mb-4">
          <Link href="/account/orders" className="hover:text-primary">← All Orders</Link>
        </Eyebrow>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <Headline>Order {displayId}</Headline>
          <span className="inline-block self-start px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold bg-primary-container/15 text-primary">
            {status}
          </span>
        </div>
        <BodyText className="text-on-surface-variant/80 mt-2">{date}</BodyText>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <p className="font-label-caps text-xs text-outline uppercase tracking-widest border-b border-outline-variant/30 pb-2">
          Purchased Essences
        </p>
        <ul className="divide-y divide-outline-variant/20">
          {items.map((item: any) => {
            const price = typeof item.unit_price === "number" ? formatINR(item.unit_price * (item.quantity || 1)) : "—";
            return (
              <li key={item.id} className="py-4 flex justify-between items-center gap-4">
                <div>
                  <p className="font-headline-sm text-sm text-primary">{item.title}</p>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                    Qty: {item.quantity} · {formatINR(item.unit_price)} each
                  </p>
                </div>
                <p className="font-headline-sm text-sm text-primary tabular-nums">{price}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Summary / Totals */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-3">
        <div className="flex justify-between font-body-md text-sm text-on-surface-variant">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatINR(order.subtotal || 0)}</span>
        </div>
        {order.shipping_total > 0 && (
          <div className="flex justify-between font-body-md text-sm text-on-surface-variant">
            <span>Shipping</span>
            <span className="tabular-nums">{formatINR(order.shipping_total)}</span>
          </div>
        )}
        {order.tax_total > 0 && (
          <div className="flex justify-between font-body-md text-sm text-on-surface-variant">
            <span>GST / Tax</span>
            <span className="tabular-nums">{formatINR(order.tax_total)}</span>
          </div>
        )}
        <div className="flex justify-between font-headline-sm text-base text-primary border-t border-outline-variant/30 pt-3">
          <span>Total Paid</span>
          <span className="tabular-nums">{formatINR(order.total || 0)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      {shippingAddress && (
        <div className="space-y-3">
          <p className="font-label-caps text-xs text-outline uppercase tracking-widest border-b border-outline-variant/30 pb-2">
            Delivery Destination
          </p>
          <div className="font-body-md text-sm text-on-surface space-y-1">
            <p className="font-semibold text-primary">
              {shippingAddress.first_name} {shippingAddress.last_name}
            </p>
            <p>{shippingAddress.address_1}</p>
            {shippingAddress.address_2 && <p>{shippingAddress.address_2}</p>}
            <p>
              {shippingAddress.city}, {shippingAddress.province || ""} {shippingAddress.postal_code}
            </p>
            {shippingAddress.phone && <p className="text-on-surface-variant text-xs mt-2">Phone: {shippingAddress.phone}</p>}
          </div>
        </div>
      )}
    </PageShell>
  );
}
