import React from 'react'
import  Hero  from './components/Hero'
import  Features  from './components/Features'
import  HowItWorks  from './components/HowItWorks'
import CTA  from './components/CTA'
import  {useNavigate}  from 'react-router-dom'
import  Header  from './components/Header'
import Footer  from './components/Footer'


function Home() {
  const navigate = useNavigate();

  
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
