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
      <Preview>Your Maison GALLE order {orderNumber} is confirmed.</Preview>
      <Body style={mainBg}>
        <Container style={containerStyle}>
          {/* Logo / Header */}
          <div style={logoContainer}>
            <Heading style={logoStyle}>GALLE</Heading>
            <Text style={subtitleStyle}>MAISON DE FRAGRANCE</Text>
          </div>

          <hr style={dividerStyle} />

          {/* Greeting */}
          <Text style={greetingStyle}>Dear {customerName},</Text>

          {/* Headline */}
          <Heading style={headlineStyle}>YOUR ORDER HAS BEEN CONFIRMED</Heading>

          <Text style={bodyTextStyle}>
            We are pleased to inform you that your request for our signature essence has been received and is being prepared with the utmost care in our boutique.
          </Text>

          {/* Details Block */}
          <div style={detailsBox}>
            <div style={detailRow}>
              <span style={detailLabel}>Order Reference:</span>
              <strong style={detailValue}>{orderNumber}</strong>
            </div>
            <div style={detailRow}>
              <span style={detailLabel}>Grand Total:</span>
              <strong style={detailValue}>{totalINR}</strong>
            </div>
            <div style={detailRow}>
              <span style={detailLabel}>Shipping Status:</span>
              <span style={detailValue}>Preparing to Ship via Shiprocket</span>
            </div>
          </div>

          <Text style={bodyTextStyle}>
            A shipping notification containing your Shiprocket tracking coordinates will be sent to you as soon as your essence leaves the Maison.
          </Text>

          {/* Closing */}
          <div style={signatureSection}>
            <Text style={closingStyle}>Warmest regards,</Text>
            <Text style={signatureBrandStyle}>Maison GALLE</Text>
          </div>

          <hr style={dividerStyle} />

          {/* Footer */}
          <div style={footerStyle}>
            <Text style={footerTextStyle}>
              This is an automated confirmation of your order. If you have any inquiries, please contact our concierge at support@galleluxe.com.
            </Text>
            <Text style={footerCopyrightStyle}>
              © {new Date().getFullYear()} GALLE. All rights reserved.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

// Styling definitions
const mainBg = {
  backgroundColor: "#FCFBF9",
  fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  padding: "40px 0",
};

const containerStyle = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  border: "1px solid #F1EFEA",
  padding: "48px 40px",
};

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logoStyle = {
  color: "#3A3333",
  fontSize: "32px",
  fontWeight: "500",
  letterSpacing: "0.25em",
  margin: "0 0 4px 0",
  fontFamily: "inherit",
};

const subtitleStyle = {
  color: "#817474",
  fontSize: "9px",
  letterSpacing: "0.4em",
  margin: "0",
  textTransform: "uppercase" as const,
  fontWeight: "500",
};

const dividerStyle = {
  border: "none",
  borderTop: "1px solid #F1EFEA",
  margin: "32px 0",
};

const greetingStyle = {
  fontSize: "15px",
  color: "#3A3333",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const headlineStyle = {
  color: "#3A3333",
  fontSize: "18px",
  fontWeight: "600",
  letterSpacing: "0.15em",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const bodyTextStyle = {
  fontSize: "14px",
  color: "#5C4F4F",
  lineHeight: "1.7",
  margin: "0 0 24px 0",
};

const detailsBox = {
  backgroundColor: "#FCFBF9",
  border: "1px solid #F1EFEA",
  padding: "24px",
  marginBottom: "28px",
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "13px",
  color: "#3A3333",
  marginBottom: "12px",
  lineHeight: "1.5",
};

const detailLabel = {
  color: "#817474",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  fontSize: "11px",
};

const detailValue = {
  fontWeight: "600",
};

const signatureSection = {
  marginTop: "40px",
};

const closingStyle = {
  fontSize: "14px",
  color: "#5C4F4F",
  margin: "0 0 4px 0",
  fontStyle: "italic",
};

const signatureBrandStyle = {
  fontSize: "14px",
  color: "#3A3333",
  fontWeight: "600",
  letterSpacing: "0.1em",
  margin: "0",
  textTransform: "uppercase" as const,
};

const footerStyle = {
  textAlign: "center" as const,
};

const footerTextStyle = {
  fontSize: "11px",
  color: "#A29595",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const footerCopyrightStyle = {
  fontSize: "10px",
  color: "#C3B9B9",
  letterSpacing: "0.05em",
  margin: "0",
};
