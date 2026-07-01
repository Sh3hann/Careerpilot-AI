import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "CareerPilot AI – AI Career & Portfolio Builder",
  description: "Build stunning portfolios, create ATS-optimized CVs, practice AI interviews, and get expert career feedback with CareerPilot AI.",
  keywords: "AI portfolio builder, CV generator, interview practice, career coach, resume builder",
  openGraph: {
    title: "CareerPilot AI – AI Career & Portfolio Builder",
    description: "Your AI-powered career assistant. Build portfolios, CVs, and ace interviews.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a2035',
                color: '#F8FAFC',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#22D3EE',
                  secondary: '#0D1526',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#0D1526',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
