import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AIVized | Client Onboarding",
    template: "%s | AIVized",
  },
  description:
    "AIVized client onboarding portal. Tell us about your business, share your project requirements and submit your materials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className={`${manrope.variable} font-sans`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
