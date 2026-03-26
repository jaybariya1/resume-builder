import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Sparkles, Wand2, FileText, Zap, ArrowRight, Check, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from 'motion/react';
// import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-15 sm:py-32 bg-gradient-to-br from-orange-50 via-white to-[#f8f8f8]">
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
          
          {/* <div className="relative mx-auto mt-10 max-w-lg lg:col-span-5 lg:mx-0 lg:mt-0 lg:max-w-none xl:col-span-6">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-2xl ring-1 ring-orange-200">
              
            </div>
            
            Floating cards
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
          </div> */}

          <section >
        <div className=" w-xl h-2xl">
          {/* Left Content */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-orange-100 text-orange-700 border-orange-200 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI Powered
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Build Your Perfect Resume with{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Transform your career story into a compelling resume in minutes. Our AI analyzes 
              job descriptions, optimizes content, and crafts professional summaries that get you noticed.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-xl shadow-orange-200 group"
              >
                Create My Resume
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-orange-200 hover:bg-orange-50"
              >
                See Examples
              </Button>
            </div>

            {/* Feature Pills */}
            {/* <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
                <Wand2 className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">AI Content Generation</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-green-100">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Professional Templates</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Free to Start</span>
              </div>
            </div>
          </motion.div> */}

          {/* Right Content - Resume Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* AI Suggestions Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full shadow-xl z-10 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold text-sm">AI Suggestions Applied</span>
              </motion.div>

              {/* Resume Preview Card */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 lg:p-10 relative overflow-hidden">
                {/* Gradient Background Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-3xl opacity-30 -z-10"></div>
                
                {/* Resume Content */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-orange-600" />
                      <div className="h-3 bg-orange-100 rounded w-24"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 bg-gray-100 rounded w-full"></div>
                      <div className="h-2.5 bg-gray-100 rounded w-full"></div>
                      <div className="h-2.5 bg-gray-100 rounded w-4/5"></div>
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-3 bg-orange-100 rounded w-28"></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                          <div className="space-y-1.5 ml-4">
                            <div className="h-2 bg-gray-100 rounded w-full"></div>
                            <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-3 bg-orange-100 rounded w-16"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-full w-20"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quality Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute bottom-6 right-6 bg-green-50 border border-green-200 rounded-lg px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">Highly Optimized</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 top-20 bg-white rounded-xl shadow-lg p-4 border border-orange-100"
            >
              <Wand2 className="w-6 h-6 text-orange-600" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-6 bottom-20 bg-white rounded-xl shadow-lg p-4 border border-purple-100"
            >
              <Zap className="w-6 h-6 text-purple-600" />
            </motion.div>
          </motion.div>
        </div>
      </section>
        </div>
      </div>
    </section>
  );
}
