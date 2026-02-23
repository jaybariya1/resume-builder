import React from 'react'
import Hero from './pages/home/Hero'
import Features from './pages/home/Features'
import HowItWorks from './pages/home/HowItWorks'
import CTA from './pages/home/CTA'
import Header from './pages/home/Header'
import Footer from './pages/home/Footer'


function Home() {
  
  return (


    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        {/* <Stats /> */}
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default Home
