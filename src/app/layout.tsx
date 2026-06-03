import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'
import { Providers } from './providers'
import { AIChat } from '@/components/ai/AIChat'
import Header from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const viewport = 'width=device-width, initial-scale=1'

export const metadata: Metadata = {
  title: 'Aquila Plumbing | Professional Plumbing Services',
  description: 'Book expert plumbers for all your plumbing needs. Emergency services, installations, repairs, and maintenance.',
  keywords: 'plumber, plumbing, emergency, repair, installation, maintenance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} pt-20`}>
        <Providers>
          <SmoothScrollProvider>
            <Header />
            {children}
            <AIChat />
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  )
}
