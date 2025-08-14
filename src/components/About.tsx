import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import phoneMockup from "@/assets/phone-mockup.jpg";

const About = () => {
  const benefits = [
    "One app replaces 10+ separate applications",
    "Ghana Card verification ensures authentic users",
    "End-to-end encryption for all communications",
    "Local mobile money integration",
    "AI-powered content moderation",
    "24/7 customer support in local languages"
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Built for 
                <span className="bg-hero-gradient bg-clip-text text-transparent"> Ghana</span>,
                <br />
                Expanding to Africa
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                DAILI isn't just another app - it's a digital ecosystem designed specifically 
                for African users, starting with Ghana. We understand local needs, payment 
                methods, and cultural nuances.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-ghana-green flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-hero-gradient hover:shadow-glow text-white font-semibold px-8 py-6 text-lg h-auto"
              >
                Join the Beta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-8 py-6 text-lg h-auto"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={phoneMockup} 
                alt="DAILI App Interface" 
                className="w-full max-w-md mx-auto rounded-3xl shadow-elegant"
              />
            </div>
            
            {/* Background Elements */}
            <div className="absolute inset-0 bg-accent-gradient rounded-3xl blur-3xl opacity-30 scale-110"></div>
            
            {/* Floating Stats Cards */}
            <Card className="absolute -top-4 -left-4 bg-card-gradient shadow-card animate-float">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </CardContent>
            </Card>
            
            <Card className="absolute -bottom-4 -right-4 bg-card-gradient shadow-card animate-float" style={{animationDelay: '1s'}}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-ghana-green">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;