import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ConditionalLayout from "@/components/ConditionalLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NyayAI - Your Legal AI Assistant for Indian Laws",
    template: "%s | NyayAI",
  },
  description: "Get instant, accurate answers to your legal questions with NyayAI, powered by advanced AI technology for Indian law. Navigate Indian legal system with confidence.",
  keywords: [
    "legal AI",
    "Indian law",
    "legal assistant",
    "RAG",
    "legal chatbot",
    "constitutional law",
    "criminal law",
    "corporate law",
    "legal advice",
    "Indian legal system",
  ],
  authors: [{ name: "NyayAI Team" }],
  creator: "NyayAI",
  publisher: "NyayAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "NyayAI - Your Legal AI Assistant for Indian Laws",
    description: "Get instant, accurate answers to your legal questions with NyayAI, powered by advanced AI technology for Indian law.",
    siteName: "NyayAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NyayAI - Legal AI Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NyayAI - Your Legal AI Assistant for Indian Laws",
    description: "Get instant, accurate answers to your legal questions with NyayAI, powered by advanced AI technology for Indian law.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6B8E23" },
    { media: "(prefers-color-scheme: dark)", color: "#6B8E23" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-neutral-50 text-neutral-800 font-sans antialiased">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        {/* <Footer /> */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#171717',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#6B8E23',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#6B8E23',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
