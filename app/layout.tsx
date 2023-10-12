import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Motion',
  description: 'The connected workspace where better, faster work happens',
  icons : {
    icon :[
     {
      media : "(prefers-color-scheme: dark)",
      url : "/dark-logo.svg",
      href : '/dark-logo.svg'
    },
    {
      media : "(prefers-color-scheme: light)",
      url : "/logo.svg",
      href : '/logo.svg'
    },
  ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
