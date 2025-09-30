import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "reactflow/dist/style.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Industrial Automation Platform",
  description: "Real-time monitoring, data analytics and visual pipeline editor for industrial automation.",
  icons: {
    icon: "/favicon.svg",
  },
  themeColor: "#0ea5e9",
  applicationName: "Industrial Automation",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
