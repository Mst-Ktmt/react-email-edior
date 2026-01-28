import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

export const metadata: Metadata = {
  title: "Email Editor",
  description: "Drag and drop email template editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
