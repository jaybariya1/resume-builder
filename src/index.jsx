import React from 'react'
import Hero from './pages/home/Hero'
import Features from './pages/home/Features'
import HowItWorks from './pages/home/HowItWorks'
import CTA from './pages/home/CTA'
import Header from './pages/home/Header'
import Footer from './pages/home/Footer'
import TemplateShowcase from "./components/TemplateShowcase"
import { useNavigate } from 'react-router-dom'


function Home() {
  const navigate = useNavigate();
  const handleSelectTemplate = (templateId) => {
    navigate(`/resume/new?template=${templateId}`);
  };
  
  return (

    

    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <main >
        <Hero />
        {/* ── TEMPLATE SHOWCASE (below hero) ── */}
      <TemplateShowcase onSelectTemplate={handleSelectTemplate} />
        <Features />
        <HowItWorks />
        {/* <Stats /> */}
        {/* <CTA /> */}
      </main>
      <Footer />
    </div>
  )
}

export default Home
