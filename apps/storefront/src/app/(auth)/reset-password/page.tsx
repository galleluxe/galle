import { PageShell } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Display, BodyText } from "@/components/typography/display";

export default function ResetPasswordPage() {
  return (
    <PageShell className="pt-8 pb-section-gap max-w-md mx-auto">
      <Display className="text-display-lg-mobile mb-6 text-center">
        New Password
      </Display>
      <BodyText className="text-center mb-8">
        Choose a new password for your account.
      </BodyText>
      <form className="space-y-6">
        <Input label="New password" name="password" type="password" required />
        <Input label="Confirm password" name="confirmPassword" type="password" required />
        <Button type="submit" variant="primary" className="w-full">
          Update Password
        </Button>
      </form>
    </PageShell>
  );
}
