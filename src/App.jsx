import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
// import Stats from "./components/Stats";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import CreateResume from "./components/CreateResume";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import { Outlet } from "react-router-dom";

// import { useUser } from "./hooks/useUser";

function App() {

 
  // const { user, profile, loading } = useUser()

  // if (loading) return <p className="p-6">Loading...</p>
  // if (!user) return <p className="p-6">Please log in.</p>

  // async function logout() {
  //   await supabase.auth.signOut()
  //   window.location.href = "/"
  // }

  return (
    // <div>
    //   <Header/>
    //   <Home/>
    //   <Footer/>
    // </div>

    // <div className="min-h-screen bg-background">
    //   <Header 
    //     onCreateResumeClick={handleCreateResumeClick}
    //     onDashboardClick={handleDashboardClick}
    //     isAuthenticated={isAuthenticated}
    //     onSignOut={handleSignOut}
    //   />
    //   <main>
    //     <Hero onCreateResumeClick={handleCreateResumeClick} />
    //     <Features />
    //     <HowItWorks />
    //     {/* <Stats /> */}
    //     <CTA onCreateResumeClick={handleCreateResumeClick} />
    //   </main>
    //   <Footer />
    // </div>
    <div className="min-h-screen bg-background">

      <main>
        <Outlet /> {/* renders child route */}
      </main>
    </div>


  );
}

export default App;
