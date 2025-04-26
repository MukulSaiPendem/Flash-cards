import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlashCard Buddy",
  description: "Create and review flashcards to boost your learning",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-rose-600">
                FlashCard Buddy
              </a>
              <div className="flex gap-4">
                <a href="/" className="text-gray-600 hover:text-rose-600">
                  Home
                </a>
                <a href="/create" className="text-gray-600 hover:text-rose-600">
                  Create
                </a>
                <a href="/review" className="text-gray-600 hover:text-rose-600">
                  Review
                </a>
              </div>
            </nav>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
