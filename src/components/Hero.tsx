import { Button } from "@/components/ui/button";
import { Play, Download, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-accent-gradient">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-ghana-gold/10 border border-ghana-gold/20">
              <Star className="w-4 h-4 text-ghana-gold mr-2" />
              <span className="text-sm font-medium text-ghana-gold-foreground">
                Ghana's First Super-App
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                One App
              </span>
              <br />
              <span className="text-foreground">
                for Everything
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              DAILI revolutionizes your digital life in Ghana. Chat, shop, work, learn, 
              and socialize - all in one secure, verified platform designed for Africa.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-hero-gradient hover:shadow-glow text-white font-semibold px-8 py-6 text-lg h-auto"
            >
              <Download className="mr-2 h-5 w-5" />
              Download DAILI
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-8 py-6 text-lg h-auto"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">500K+</div>
              <div className="text-sm text-muted-foreground">Early Adopters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Security Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative lg:block hidden">
          <div className="relative">
            <img 
              src={heroImage} 
              alt="DAILI Super-App Interface" 
              className="w-full h-auto rounded-2xl shadow-elegant animate-float"
            />
            {/* Floating UI Elements */}
            <div className="absolute -top-4 -left-4 bg-card rounded-xl p-4 shadow-card animate-float" style={{animationDelay: '1s'}}>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">💬</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-card rounded-xl p-4 shadow-card animate-float" style={{animationDelay: '2s'}}>
              <div className="w-12 h-12 bg-ghana-gold rounded-lg flex items-center justify-center">
                <span className="text-ghana-gold-foreground font-bold">🛒</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;