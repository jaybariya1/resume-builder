import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Upload, Brain, Download, ArrowRight } from "lucide-react";
// import { ImageWithFallback } from "./figma/ImageWithFallback";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Information",
    description: "Import from LinkedIn, upload your existing resume, or start from scratch with our guided questionnaire."
  },
  {
    number: "02", 
    icon: Brain,
    title: "AI Analysis & Enhancement",
    description: "Our AI analyzes your content, suggests improvements, and optimizes everything for ATS compatibility."
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Apply",
    description: "Get your polished, professional resume in multiple formats and start applying to your dream jobs."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-30 sm:py-32 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Simple Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl">
            From raw experience to perfect resume in 3 steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our streamlined process makes it easy to create a professional resume that stands out, 
            even if you've never written one before.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          STEP {step.number}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-6">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              <div className="pt-4">
                <Button size="lg" className="group">
                  Start Building Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src="https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTc2NjUwNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="AI technology visualization"
                    className="h-96 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-lg bg-background/95 p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        AI is optimizing your resume...
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Analyzing keywords, improving structure, enhancing content
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}