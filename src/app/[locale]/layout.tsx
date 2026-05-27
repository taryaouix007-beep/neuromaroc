import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Locale, getDictionary } from "@/dictionaries";
import { LanguageProvider } from "@/context/LanguageContext";
import { JsonLd } from "@/components/JsonLd";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});


export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || "fr") as Locale;
  const dict = await getDictionary(locale);

  const title = dict.seo?.title || "INFC — Centre de Régulation Neuro-Sensible Premium au Maroc";
  const description = dict.seo?.description || "Une approche naturelle et non invasive pour libérer votre cerveau du stress.";
  const keywords = dict.seo?.keywords || "neurofeedback maroc, entraînement cérébral";

  const siteUrl = "https://neuromaroc.com";

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        fr: `${siteUrl}/fr`,
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName: "INFC Maroc — Neurofeedback NeurOptimal®",
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_MA" : "en_US",
      type: "website",
      images: [
        {
          url: "/assets/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "INFC Maroc Neurofeedback",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/images/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/favicons/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [
        { url: "/favicons/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
        { url: "/favicons/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
        { url: "/favicons/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
        { url: "/favicons/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
        { url: "/favicons/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
        { url: "/favicons/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
        { url: "/favicons/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
        { url: "/favicons/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
        { url: "/favicons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          rel: "apple-touch-icon-precomposed",
          url: "/favicons/apple-icon-precomposed.png",
        },
        {
          rel: "shortcut icon",
          url: "/favicons/favicon.ico",
        },
      ],
    },
    manifest: "/favicons/manifest.json",
    other: {
      "msapplication-config": "/favicons/browserconfig.xml",
      "msapplication-TileColor": "#ffffff",
      "msapplication-TileImage": "/favicons/ms-icon-144x144.png",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || "fr") as Locale;
  const dictionary = await getDictionary(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const siteUrl = "https://neuromaroc.com";
  const title = dictionary.seo?.title || "INFC — Centre de Régulation Neuro-Sensible Premium au Maroc";
  const description = dictionary.seo?.description || "Une approche naturelle et non invasive pour libérer votre cerveau du stress.";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "International Neurofeedback Center (INFC)",
    "image": `${siteUrl}/assets/logos/logo.png`,
    "description": description,
    "telephone": "0522991783",
    "url": `${siteUrl}/${locale}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nº12 2ème étage, Immeuble Living office 362 BD Ghandi Oasis",
      "addressLocality": "Casablanca",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.5627",
      "longitude": "-7.6328"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    }
  };

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${outfit.variable} ${locale === "ar" ? "rtl" : ""}`}>
        <JsonLd 
          type="MedicalBusiness" 
          data={schemaData} 
        />
        <LanguageProvider locale={locale} dictionary={dictionary}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
