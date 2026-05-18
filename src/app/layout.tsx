import type { Metadata, Viewport } from "next";
import { Amiri, Inter, Noto_Nastaliq_Urdu, Poppins } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollProgress } from "@/components/scroll-progress";
import { siteConfig } from "@/lib/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"]
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: ["/teacher-kamran.jpeg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/teacher-kamran.jpeg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} ${amiri.variable} ${notoNastaliq.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <ScrollProgress />
          {children}
        </ThemeProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
