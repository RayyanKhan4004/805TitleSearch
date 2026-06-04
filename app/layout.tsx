import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./store/provider";
import { AuthProvider } from "./context/auth-context";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "805titleIQ",
    description: "805titleIQ — Intelligent Title Production Workflow",
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
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
