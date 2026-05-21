/** Payload `/admin` renders its own `<html>` — root must not wrap it. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
