import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'RoastMySite - Get Your Website Brutally Roasted by AI',
    description: 'Enter your URL and let AI roast your website. Get a score, brutally honest feedback, and share your shame (or glory) with the world.',
    openGraph: {
          title: 'RoastMySite - Get Your Website Brutally Roasted by AI',
          description: 'Enter your URL and let AI roast your website. Get a score and brutally honest feedback.',
          type: 'website',
    },
    twitter: {
          card: 'summary_large_image',
          title: 'RoastMySite - Get Your Website Brutally Roasted by AI',
          description: 'Enter your URL and let AI roast your website.',
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
          <html lang="en">
                <body className="font-sans">{children}</body>body>
          </html>html>
        )
}</html>
