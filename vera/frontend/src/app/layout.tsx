import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-neutral-950 text-neutral-50 font-sans antialiased">
        {children}
        {/* <Footer /> */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#171717',
              color: '#fafafa',
              border: '1px solid #404040',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#ad46ff',
                secondary: '#171717',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#171717',
              },
            },
            loading: {
              iconTheme: {
                primary: '#ad46ff',
                secondary: '#171717',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
