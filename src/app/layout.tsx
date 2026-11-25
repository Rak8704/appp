
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "দৈনিক দিনলিপি | সত্যের সন্ধানে, প্রতিদিন",
    template: "%s | দৈনিক দিনলিপি",
  },
  description:
    "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, রাজনীতি, অর্থনীতি, খেলাধুলা, বিনোদন ও প্রযুক্তির খবর পড়ুন দৈনিক দিনলিপিতে।",
  keywords: [
    "দৈনিক দিনলিপি",
    "বাংলা সংবাদ",
    "বাংলাদেশের খবর",
    "Latest Bangla News",
  ],
  openGraph: {
    title: "দৈনিক দিনলিপি",
    description: "সত্যের সন্ধানে, প্রতিদিন",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
