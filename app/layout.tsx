import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "./store/provider";
import { AuthProvider } from "./context/auth-context";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "805 Title Search",
  description: "805TS Production Workflow for Title Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col m-0 overflow-hidden bg-[#f1f5f9]" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        <StoreProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
