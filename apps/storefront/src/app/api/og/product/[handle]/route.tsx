import { ImageResponse } from "next/og";
import { getProduct } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const product = await getProduct(handle);

  const title = product?.title ?? "GALLE";
  const subtitle = product?.subtitle ?? "Ethereal Essence";
  const thumbnail = product?.thumbnail ?? "/5.png";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://galle.com";
  const imgSrc = thumbnail.startsWith("http")
    ? thumbnail
    : `${siteUrl}${thumbnail}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#faf9f5",
          alignItems: "center",
          padding: "60px 80px",
          gap: 60,
          fontFamily: "serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse/Satori requires native img */}
        <img
          src={imgSrc}
          alt={title}
          style={{
            width: 380,
            height: 500,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: 14,
              letterSpacing: "0.3em",
              color: "#817474",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            MAISON GALLE
          </p>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 400,
              color: "#7c2c2e",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 22, color: "#4f4444", margin: 0 }}>
            {subtitle}
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
