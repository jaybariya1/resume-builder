import React from 'react'
import Hero from './components/marketing/Hero'
import  Features  from './components/marketing/Features'
import  HowItWorks  from './pages/HowItWorks'
import CTA  from './pages/CTA'
import  Header  from './components/layout/Header'
import Footer  from './components/layout/Footer'


function Home() {
  
  return (
    // <div> 
    //   <Hero/>
    //   <Features/>
    //   <HowItWorks/>
    //   <CTA/>
    // </div>
  

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
