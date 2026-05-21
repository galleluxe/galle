import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface Props {
  orderNumber: string;
  customerName: string;
  totalINR: string;
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  totalINR,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your GALLE order {orderNumber} is confirmed.</Preview>
      <Body style={{ backgroundColor: "#faf9f5", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
          <Heading style={{ color: "#6f5959", letterSpacing: "0.1em" }}>
            GALLE
          </Heading>
          <Text>Dear {customerName},</Text>
          <Text>
            Your order <strong>{orderNumber}</strong> has been confirmed. Total:{" "}
            {totalINR}.
          </Text>
          <Text>
            We will send you a shipping notification once your fragrance is on
            its way.
          </Text>
          <Text style={{ color: "#817474", fontSize: 12 }}>
            Maison GALLE · Ethereal Essence
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
