import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

export function PasswordResetEmail({
  resetUrl,
}: {
  resetUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Reset your GALLE password.</Preview>
      <Body style={{ backgroundColor: "#faf9f5", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
          <Heading style={{ color: "#6f5959", letterSpacing: "0.1em" }}>
            GALLE
          </Heading>
          <Text>Click below to reset your password. Link expires in 1 hour.</Text>
          <Link href={resetUrl} style={{ color: "#735c00" }}>
            Reset password
          </Link>
          <Text style={{ color: "#817474", fontSize: 12 }}>
            If you did not request this, ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
