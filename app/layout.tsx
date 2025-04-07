import type React from "react"
import "./globals.css"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import {ThemeProvider} from "@/components/theme-provider"
import './globals.css'

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "ME-Gui",
    description: "Generate Lua scripts for API automation",
    generator: 'v0.dev'
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}


