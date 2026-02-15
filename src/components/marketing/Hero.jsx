import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),rgba(255,255,255,0))]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <div className="mb-8">
              <Badge variant="secondary" className="inline-flex items-center gap-1 px-3 py-1">
                <Sparkles className="h-3 w-3" />
                AI Powered
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold sm:text-6xl lg:text-7xl">
              Build Your Perfect Resume with{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-orange-600 via-red-500 to-orange-800 bg-clip-text text-transparent">
                  AI Magic
                </span>
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Transform your career story into a compelling resume in minutes. Our AI analyzes job descriptions, 
              optimizes content for ATS systems, and crafts professional summaries that get you noticed.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/resume/new')}
                className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create My Resume
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                See Examples
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>ATS Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI Content Generation</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500" />
                <span>Free to Start</span>
              </div>
            </div>
          </div>
          
          <div className="relative mx-auto mt-10 max-w-lg lg:col-span-5 lg:mx-0 lg:mt-0 lg:max-w-none xl:col-span-6">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-2xl ring-1 ring-orange-200">
              {/* <ImageWithFallback 
                src="https://images.unsplash.com/photo-1587287720754-94bac45f0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXN1bWUlMjBkb2N1bWVudHxlbnwxfHx8fDE3NTc3MzQzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional resume document"
                className="h-full w-full object-cover"
              /> */}
            </div>
            
            {/* Floating cards */}
            <div className="absolute -right-4 top-8 transform rotate-3">
              <div className="rounded-xl bg-white p-4 shadow-xl border border-orange-100 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-gray-900">AI Suggestions Applied</span>
                </div>
              </div>
            </div>
            
            <div className="absolute -left-4 bottom-8 transform -rotate-2">
              <div className="rounded-xl bg-white p-4 shadow-xl border border-green-100 backdrop-blur-sm">
                <div className="text-sm">
                  <div className="font-medium text-green-600">ATS Score: 95%</div>
                  <div className="text-gray-600">Highly optimized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
