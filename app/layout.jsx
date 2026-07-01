import "./globals.css";

export const metadata = {
  title: "Michelle's Gatherings",
  description: "Michelle's Gatherings standalone design",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
