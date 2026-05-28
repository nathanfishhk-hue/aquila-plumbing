'use client'

import dynamic from 'next/dynamic'

const HeroVideoComponent = dynamic(() => import('./HeroVideoContent'), {
  ssr: false,
})

export default function HeroVideo() {
  return <HeroVideoComponent />
}