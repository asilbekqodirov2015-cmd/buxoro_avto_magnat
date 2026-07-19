import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { AppProvider } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWidgets from "../components/FloatingWidgets";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buxoro Avto Magnat | Rasmiy Chevrolet Shourumi",
  description: "Buxoro Avto Magnat - Buxorodagi premium Chevrolet dilerlik markazi. Avtomobillar sotuvi, test-drayv, qulay avtokredit va trade-in xizmatlari.",
  keywords: "chevrolet buxoro, avto magnat buxoro, buy car bukhara, chevrolet uzbekistan, malibu buxoro, tracker kredit, avtosalon buxoro",
  openGraph: {
    title: "Buxoro Avto Magnat | Rasmiy Chevrolet Shourumi",
    description: "Buxoroda eng so'nggi rusumdagi Chevrolet avtomobillari kafolat va qulay kredit shartlari asosida.",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800"],
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <AppProvider>
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <FloatingWidgets />
              </AppProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
