import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SWRegistration from "@/components/pwa/SWRegistration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker PWA",
  description: "Track your habits and stay consistent.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Habit Tracker",
  },
};
// Required for the PWA theme color & address bar styling
export const viewport: Viewport = {
  themeColor: "#cf423a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SWRegistration />
        {children}
      </body>
    </html>
  );
}
