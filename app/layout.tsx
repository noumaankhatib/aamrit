import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import IconSprite from "@/components/IconSprite";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title:
    "Aamrit — Premium Alphonso Mangoes from our farms in Ratnagiri & Raigad | Yeskay Mango Farms",
  description:
    "Direct from 600+ acres and 22,000+ trees across 12 family farms in Ratnagiri & Raigad — naturally ripened, hand-picked Alphonso mangoes. Yeskay Mango Farms — growing since generations, established 1985.",
  openGraph: {
    title: "Aamrit — Rooted in Nature, Ripened to Perfection",
    description:
      "Premium Alphonso mangoes from our owned orchards in Ratnagiri & Raigad. Established 1985.",
  },
};

const organisationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aamrit",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description:
    "Premium Alphonso mangoes from owned orchards in Ratnagiri & Raigad, Maharashtra.",
  brand: { "@type": "Brand", name: "Aamrit" },
  parentOrganization: { "@type": "Organization", name: "Yeskay Mango Farms" },
};

export const viewport: Viewport = {
  themeColor: "#F4A300",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationLd) }}
        />
        <IconSprite />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
