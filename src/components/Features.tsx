import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  ShoppingCart, 
  Video, 
  Users, 
  Shield, 
  Zap,
  TrendingUp,
  MapPin,
  Heart,
  Briefcase,
  Calendar,
  Globe
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Instant Messaging",
      description: "WhatsApp-style messaging with end-to-end encryption, group chats, and voice notes.",
      gradient: "from-primary to-primary/70"
    },
    {
      icon: ShoppingCart,
      title: "Marketplace",
      description: "Buy and sell products locally with integrated mobile money payments and seller verification.",
      gradient: "from-ghana-gold to-ghana-gold/70"
    },
    {
      icon: Video,
      title: "Video Meetings",
      description: "Host professional meetings with screen sharing, recording, and participant management.",
      gradient: "from-ghana-green to-ghana-green/70"
    },
    {
      icon: Users,
      title: "Social Network",
      description: "Connect with friends, share stories, and discover content from your community.",
      gradient: "from-blue-500 to-blue-400"
    },
    {
      icon: Shield,
      title: "Ghana Card Verified",
      description: "Maximum security with mandatory Ghana Card verification and biometric authentication.",
      gradient: "from-purple-500 to-purple-400"
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Smart recommendations, content moderation, and real-time translation services.",
      gradient: "from-orange-500 to-orange-400"
    },
    {
      icon: TrendingUp,
      title: "Business Tools",
      description: "Analytics, inventory management, and customer relationship tools for entrepreneurs.",
      gradient: "from-teal-500 to-teal-400"
    },
    {
      icon: MapPin,
      title: "Location Services",
      description: "Find nearby businesses, share locations, and discover local events and services.",
      gradient: "from-green-500 to-green-400"
    },
    {
      icon: Heart,
      title: "Community Q&A",
      description: "Ask questions, share knowledge, and get expert advice from verified professionals.",
      gradient: "from-pink-500 to-pink-400"
    },
    {
      icon: Briefcase,
      title: "Professional Network",
      description: "Build your career with LinkedIn-style networking and job opportunities.",
      gradient: "from-indigo-500 to-indigo-400"
    },
    {
      icon: Calendar,
      title: "Productivity Suite",
      description: "Manage tasks, schedule meetings, and collaborate with integrated productivity tools.",
      gradient: "from-cyan-500 to-cyan-400"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Communicate across language barriers with real-time translation and local language support.",
      gradient: "from-violet-500 to-violet-400"
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Everything You Need,
            <span className="bg-hero-gradient bg-clip-text text-transparent"> In One App</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            DAILI combines the best features from multiple apps into one unified platform, 
            specifically designed for the Ghanaian digital lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card-gradient border-border/50 hover:border-border"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;