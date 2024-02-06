import { getPairData } from '@/crypto-all-in-one/web3-config/swap-router';
import { Metadata } from 'next'
import React from 'react'

export const generateMetadata = async ({ params, searchParams }: any) => {
  const metadata = {
    metadataBase: new URL('https://YOUR_WEBSITE_URL'),
    title: 'Remove Liquidity ',
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
      title: 'Remove Liquidity ',
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
  try {
    const res = await getPairData(null, params?.id) as any[]
    const symbol1 = res[0]?.symbol as string
    const symbol2 = res[1]?.symbol as string
    const title = `Remove Liquidity ${symbol1}-${symbol2} `
    return {
      ...metadata,
      title,
      openGraph: {
        ...metadata.openGraph,
        title
      },
    }
  } catch (error) {
    return metadata
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