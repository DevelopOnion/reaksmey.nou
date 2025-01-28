import "./globals.css"
import { Inter } from "next/font/google"
import { HashIcon as Onion } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RateC - Campus Facility Rater",
  description: "Rate and review facilities around your university campus",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#f8f7fd]">
          <header className="bg-black text-white shadow-lg">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold custom-title flex items-center">
                RateC
                <Onion className="ml-2 h-8 w-8" />
              </h1>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}

