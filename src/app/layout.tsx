import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AskMela — AI Assistant for Ethiopian Businesses',
  description:
    'Give your business an AI assistant on Telegram. Answers customer questions in Amharic and English, 24/7. Setup in 2 minutes.',
  keywords: 'Ethiopian business, AI assistant, Telegram bot, Amharic, customer service',
  openGraph: {
    title: 'AskMela — Your Business Speaks for Itself',
    description: 'AI assistant on Telegram for Ethiopian businesses. Amharic + English. Free to start.',
    url: 'https://askmela.xyz',
    siteName: 'AskMela',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskMela — AI Assistant for Ethiopian Businesses',
    description: 'Telegram AI bot for Ethiopian businesses. Amharic + English. Setup in 2 minutes.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="am">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
