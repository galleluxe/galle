import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export function NewsletterWelcomeEmail({ email }: { email: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the GALLE atelier.</Preview>
      <Body style={{ backgroundColor: "#faf9f5", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
          <Heading style={{ color: "#6f5959", letterSpacing: "0.1em" }}>
            GALLE
          </Heading>
          <Text>
            Welcome to the atelier, {email}. You will be the first to know
            about new launches and scent stories.
          </Text>
          <Text style={{ color: "#817474", fontSize: 12 }}>
            Maison GALLE · Ethereal Essence
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
