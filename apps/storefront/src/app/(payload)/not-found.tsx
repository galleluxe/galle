import Link from "next/link";

export default function PayloadNotFound() {
  return (
    <div style={{ padding: "3rem", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Admin page not found</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        This Payload admin route does not exist or the database schema may be out of date.
      </p>
      <Link href="/admin" style={{ color: "#7c2c2e" }}>
        Back to admin dashboard
      </Link>
    </div>
  );
}
