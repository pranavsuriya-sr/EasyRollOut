import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { InventoryProvider } from "./context/InventoryContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Easy Roll Out",
  description: "Streamlining Lab Components Management for Students and Admins",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col dark`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <InventoryProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </InventoryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

