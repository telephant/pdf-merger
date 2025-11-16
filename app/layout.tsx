import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Free PDF Merger - Merge PDF Files Online, No Watermark",
  description:
    "Merge multiple PDF files into one. Fast, secure, and completely free. All processing happens in your browser — your files never leave your device.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "pdf merger online",
    "free pdf merge tool",
    "merge pdf no watermark",
  ],
  openGraph: {
    title: "Free PDF Merger - Merge PDF Files Online, No Watermark",
    description:
      "Merge multiple PDF files into one. Fast, secure, and completely free. All processing happens in your browser — your files never leave your device.",
    url: "https://yourdomain.com",
    siteName: "Free PDF Merger",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF Merge Tool",
    url: "https://yourdomain.com",
    applicationCategory: "Utility",
    operatingSystem: "All",
    description:
      "Free PDF merge tool — combine PDF files online safely and fast. No signup, no watermark.",
  };

  return (
    <html lang="en">
      <head>
        {/* basic SEO */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
