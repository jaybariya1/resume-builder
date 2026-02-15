import React from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Templates', href: '#templates' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Examples', href: '#examples' },
  ],
  support: [
    { name: 'Help Center', href: '#help' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'Status', href: '#status' },
    { name: 'Documentation', href: '#docs' },
  ],
  company: [
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '#careers' },
    { name: 'Press', href: '#press' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'GDPR', href: '#gdpr' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'Email', href: '#', icon: Mail },
];

function Footer() {
  return (
      <footer className="bg-background border-t px-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-primary">AI ResumeBuilder</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                Transform your career story with AI-powered resume building that gets results.
              </p>
              <div className="mt-6 flex space-x-4">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={item.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground">Product</h3>
              <ul className="mt-4 space-y-3">
                {navigation.product.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground">Support</h3>
              <ul className="mt-4 space-y-3">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="mt-4 space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground">Legal</h3>
              <ul className="mt-4 space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 AI ResumeBuilder. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Made with ❤️ for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
