import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  metadataBase: new URL('https://YOUR_WEBSITE_URL'),
  title: 'Staking ',
  description: '',
  applicationName: "https://YOUR_WEBSITE_URL",
  generator: "https://YOUR_WEBSITE_URL",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  robots: "index, follow",
  icons: "/images/logo.png",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://YOUR_WEBSITE_URL',
    siteName: 'https://YOUR_WEBSITE_URL',
    title: 'Staking ',
    description: '',
    images: [
      {
        url: '/images/share.png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YOUR_TWITTER",
    creator: "@YOUR_TWITTER",
    images: "/images/share.png"
  }

}

function layout(
  { children }: { children: React.ReactNode }
) {
  return (
    <>{children}</>
  )
}

export default layout