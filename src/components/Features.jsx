import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Brain, 
  Target, 
  Zap, 
  FileText, 
  Download, 
  Shield,
  Sparkles,
  Users,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Content Generation",
    description: "Our advanced AI analyzes your experience and creates compelling bullet points, summaries, and descriptions that highlight your achievements."
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Automatically optimize your resume for Applicant Tracking Systems with keyword analysis and formatting that gets past the bots."
  },
  {
    icon: Zap,
    title: "Instant Resume Creation",
    description: "Transform your LinkedIn profile or raw experience into a polished resume in under 5 minutes with our smart templates."
  },
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Choose from dozens of modern, industry-specific templates designed by hiring experts and approved by recruiters."
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description: "Download your resume as PDF, Word, or plain text. Each format is optimized for different application methods."
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your data is encrypted and secure. We never share your information and you can delete your data anytime."
  },
  {
    icon: Sparkles,
    title: "Smart Suggestions",
    description: "Get real-time suggestions for improving your resume based on industry best practices and current job market trends."
  },
  {
    icon: Users,
    title: "Industry Expertise",
    description: "Tailored advice and formatting for over 100+ industries and job roles, from entry-level to executive positions."
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track how your resume performs with detailed analytics on views, downloads, and application success rates."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-30 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">
            Everything you need to land your dream job
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI-powered platform combines cutting-edge technology with proven hiring insights 
            to create resumes that get results.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-6">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}