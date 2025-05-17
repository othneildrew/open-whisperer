import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { GlobalProvider } from "@/components/providers/global-provider";
import { AppBar } from "@/components/shad-ui/app-bar";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Whisperer",
  description: "AI Video Translator & Subtitler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // suppressHydrationWarning needed due to ThemeProvider
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png?v=05djg5"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=05djg5" />
        <link rel="shortcut icon" href="/favicon.ico?v=05djg5" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=05djg5"
        />
        <meta name="apple-mobile-web-app-title" content="Whisperer" />
        <link rel="manifest" href="/site.webmanifest?v=05djg5" />
        <title>Open Whisperer — AI Video Translator & Subtitler</title>
      </head>
      <body className={`${roboto.variable} antialiased`}>
        <GlobalProvider>
          <AppBar />
          <main className={`relative flex h-screen pt-[56px]`}>{children}</main>
        </GlobalProvider>
      </body>
    </html>
  );
}
