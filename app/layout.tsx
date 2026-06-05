import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./store/provider";
import { AuthProvider } from "./context/auth-context";

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
    <html lang="en" className="h-full antialiased" style={{ fontFamily: "'Segoe UI', 'San Francisco', 'Helvetica Neue', Arial, sans-serif" }}>
      <body className="min-h-full flex flex-col m-0 overflow-hidden bg-[#f1f5f9]">
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
