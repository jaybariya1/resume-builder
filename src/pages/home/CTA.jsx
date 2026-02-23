import { Button } from "../../components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { ImageWithFallback } from "./figma/ImageWithFallback";

function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-orange-600 via-red-600 to-orange-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.3),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 opacity-10">
        {/* <ImageWithFallback 
          src="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNTc3NDQ1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern office workspace"
          className="h-full w-full object-cover"
        /> */}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4">
            <Sparkles className="h-8 w-8 mx-auto mb-4" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl mb-6">
            Ready to transform your career?
          </h2>
          
          <p className="text-lg text-white/90 mb-8 leading-7">
            Join thousands of professionals who have successfully landed their dream jobs. 
            Create your AI-powered resume in minutes and start getting more interviews today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/resume/new')}
              className="group bg-white text-orange-700 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create My Resume Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
              View Sample Resumes
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-white/70">
            No credit card required • Free to start • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA