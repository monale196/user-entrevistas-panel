import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "User Entrevistas",
  description: "Panel privado para subir entrevistas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${merriweather.variable} antialiased bg-white dark:bg-black min-h-screen text-[#0a1b2e] dark:text-white px-4 md:px-16 py-12`}
      >
        {children}
      </body>
    </html>
  );
}
