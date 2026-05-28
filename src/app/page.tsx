import HeroVideo from '@/components/HeroVideo'
import Features from '@/components/Features'
import Services from '@/components/Services'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroVideo />
        <Features />
        <Services />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}