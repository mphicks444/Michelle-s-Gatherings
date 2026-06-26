export const metadata = {
  title: "Michelle's Gatherings",
  description: "Michelle's Gatherings standalone design"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
