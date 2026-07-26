import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const satoshi = localFont({
  src: '../../public/Satoshi_Complete/Satoshi/Fonts/WEB/fonts/Satoshi-Variable.woff2',
  variable: "--font-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Artisanal Shoemaker Catalog",
  description: "Browse our premium handcrafted shoe designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

