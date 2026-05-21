import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Headline, BodyText, Eyebrow } from "@/components/typography/display";
import { getCustomer } from "@/features/auth/server/session";
import { getCustomerOrders } from "@/features/account/server/actions";
import { formatINR } from "@/lib/money";

export default async function OrdersPage() {
  const [customer, ordersResult] = await Promise.all([
    getCustomer(),
    getCustomerOrders(),
  ]);

  if (!customer) {
    return (
      <PageShell className="pt-8 pb-section-gap max-w-2xl mx-auto">
        <Eyebrow className="mb-4">
          <Link href="/account" className="hover:text-primary">← Profile</Link>
        </Eyebrow>
        <Headline className="mb-8">Order History</Headline>
        <BodyText className="text-center py-16">
          Sign in to view your orders.
        </BodyText>
        <div className="text-center">
          <Link href="/sign-in" className="font-label-caps text-label-caps text-secondary uppercase tracking-widest hover:underline">
            Sign In
          </Link>
        </div>
      </PageShell>
    );
  }

  const orders = ordersResult.success ? (ordersResult.data as Array<Record<string, unknown>>) : [];

  return (
    <PageShell className="pt-8 pb-section-gap max-w-2xl mx-auto">
      <Eyebrow className="mb-4">
        <Link href="/account" className="hover:text-primary">← Account</Link>
      </Eyebrow>
      <Headline className="mb-8">Order History</Headline>

      {orders.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <span className="material-symbols-outlined text-5xl text-outline-variant">
            inventory_2
          </span>
          <BodyText>No orders yet. Your fragrance journey begins here.</BodyText>
          <Link
            href="/shop"
            className="font-label-caps text-label-caps text-secondary uppercase tracking-widest hover:underline"
          >
            Visit the Boutique
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-outline-variant/30 space-y-0">
          {orders.map((order) => {
            const id = String(order.id ?? "");
            const displayId = order.display_id ? `#${order.display_id}` : id.slice(-8);
            const status = String(order.fulfillment_status ?? order.status ?? "pending");
            const total = typeof order.total === "number" ? formatINR(order.total) : "—";
            const date = order.created_at
              ? new Date(order.created_at as string).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—";

            return (
              <li key={id}>
                <Link
                  href={`/account/orders/${id}`}
                  className="py-6 flex items-center justify-between gap-4 hover:bg-surface-container-low px-4 -mx-4 rounded-xl transition-all group"
                >
                  <div>
                    <p className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
                      {displayId}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{date}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-body-md text-body-md text-on-surface tabular-nums">{total}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium bg-surface-container text-on-surface-variant">
                        {status}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
