import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-2xl font-bold">DAILI</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              Ghana's first super-app revolutionizing digital life across Africa. 
              One app for everything you need.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background hover:bg-background/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:bg-background/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:bg-background/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:bg-background/10">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:bg-background/10">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-background/70 hover:text-background transition-colors">Features</a></li>
              <li><a href="#about" className="text-background/70 hover:text-background transition-colors">About Us</a></li>
              <li><a href="#security" className="text-background/70 hover:text-background transition-colors">Security</a></li>
              <li><a href="#support" className="text-background/70 hover:text-background transition-colors">Support</a></li>
              <li><a href="#careers" className="text-background/70 hover:text-background transition-colors">Careers</a></li>
              <li><a href="#blog" className="text-background/70 hover:text-background transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-background/70 hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-background/70 hover:text-background transition-colors">Terms of Service</a></li>
              <li><a href="#cookies" className="text-background/70 hover:text-background transition-colors">Cookie Policy</a></li>
              <li><a href="#compliance" className="text-background/70 hover:text-background transition-colors">Compliance</a></li>
              <li><a href="#data" className="text-background/70 hover:text-background transition-colors">Data Protection</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Connected</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-background/70">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@daili.gh</span>
              </div>
              <div className="flex items-center space-x-2 text-background/70">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-2 text-background/70">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Accra, Ghana</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-background/70">Get updates on new features</p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button size="sm" className="bg-hero-gradient hover:shadow-glow">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/70 text-sm">
            © 2024 DAILI. All rights reserved. Made with ❤️ in Ghana.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-background/70 text-sm">Available on:</span>
            <Button variant="ghost" size="sm" className="text-background hover:bg-background/10">
              App Store
            </Button>
            <Button variant="ghost" size="sm" className="text-background hover:bg-background/10">
              Play Store
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;