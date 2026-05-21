import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Headline, BodyText, Eyebrow } from "@/components/typography/display";
import { getCustomerAddresses, addCustomerAddressAction, deleteCustomerAddressAction } from "@/features/account/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const result = await getCustomerAddresses();
  const addresses = result.success ? result.data : [];

  async function handleAddAddress(formData: FormData) {
    "use server";
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      postalCode: formData.get("postalCode") as string,
      province: formData.get("province") as string,
      phone: formData.get("phone") as string,
    };

    if (!data.firstName || !data.lastName || !data.address || !data.city || !data.postalCode || !data.province || !data.phone) {
      return;
    }

    await addCustomerAddressAction(data);
    revalidatePath("/account/addresses");
  }

  async function handleDeleteAddress(formData: FormData) {
    "use server";
    const addressId = formData.get("addressId") as string;
    if (addressId) {
      await deleteCustomerAddressAction(addressId);
      revalidatePath("/account/addresses");
    }
  }

  return (
    <PageShell className="pt-8 pb-section-gap max-w-2xl mx-auto">
      <Eyebrow className="mb-4">
        <Link href="/account" className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">chevron_left</span>
          Profile
        </Link>
      </Eyebrow>
      <Headline className="mb-8">Addresses</Headline>

      {addresses.length === 0 ? (
        <BodyText className="text-center py-12 text-on-surface-variant">
          No saved addresses yet. Add one below to speed up your checkout.
        </BodyText>
      ) : (
        <div className="grid grid-cols-1 gap-6 mb-12">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <p className="font-headline-sm text-headline-sm text-primary">
                  {addr.first_name} {addr.last_name}
                </p>
                <p className="font-body-md text-body-md text-on-surface">
                  {addr.address_1}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {addr.city}, {addr.province} {addr.postal_code}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  T: {addr.phone}
                </p>
              </div>
              <form action={handleDeleteAddress}>
                <input type="hidden" name="addressId" value={addr.id} />
                <Button type="submit" variant="ghost" className="text-outline hover:text-error">
                  <span className="material-symbols-outlined">delete</span>
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-outline-variant/30 pt-10">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-6 uppercase tracking-widest">
          Add New Address
        </h3>
        <form action={handleAddAddress} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="First name" name="firstName" required />
            <Input label="Last name" name="lastName" required />
            <Input label="Address" name="address" required className="sm:col-span-2" />
            <Input label="City" name="city" required />
            <Input label="PIN code" name="postalCode" required />
            <Input label="State" name="province" required />
            <Input label="Phone" name="phone" type="tel" required />
          </div>
          <Button type="submit" variant="primary" className="w-full mt-4">
            Save Address
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
