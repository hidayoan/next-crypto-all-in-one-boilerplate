"use client"

import './globals.scss'
import { Inter } from 'next/font/google'

//crypto
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Analytics } from '@vercel/analytics/react';
import { CryptoWrapper } from '@/crypto-all-in-one';
import { Header } from '@/components';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CryptoWrapper>
          <GoogleAnalytics trackPageViews />
          <Analytics />

          <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
            position: "relative",
          }}>
            <div className="header-view">
              <Header />
            </div>
            <div className="content-view">
              {children}
            </div>
          </div>
        </CryptoWrapper>
      </body>
    </html>
  )
}