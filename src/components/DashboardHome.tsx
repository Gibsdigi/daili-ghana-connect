import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Shield,
  Star,
  ArrowRight,
  Activity
} from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    messages: 0,
    products: 0,
    posts: 0,
    verificationStatus: 'pending'
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch user's message count
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', user?.id);

      // Fetch user's product count
      const { count: productCount } = await supabase
        .from('marketplace_products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user?.id);

      // Fetch user's post count
      const { count: postCount } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user?.id);

      // Fetch verification status
      const { data: profile } = await supabase
        .from('profiles')
        .select('verification_status')
        .eq('user_id', user?.id)
        .single();

      setStats({
        messages: messageCount || 0,
        products: productCount || 0,
        posts: postCount || 0,
        verificationStatus: profile?.verification_status || 'pending'
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Send Message',
      description: 'Start a conversation',
      icon: MessageSquare,
      action: () => {},
      color: 'primary'
    },
    {
      title: 'List Product',
      description: 'Sell something',
      icon: ShoppingBag,
      action: () => {},
      color: 'ghana-gold'
    },
    {
      title: 'Create Post',
      description: 'Share with community',
      icon: Users,
      action: () => {},
      color: 'ghana-green'
    }
  ];

  const verificationCard = () => {
    const statusConfig = {
      pending: {
        color: 'secondary',
        text: 'Verification Pending',
        description: 'Complete verification to unlock all features'
      },
      verified: {
        color: 'ghana-green',
        text: 'Verified Account',
        description: 'Your account is verified and secure'
      },
      rejected: {
        color: 'destructive',
        text: 'Verification Rejected',
        description: 'Please resubmit your verification documents'
      }
    };

    const config = statusConfig[stats.verificationStatus as keyof typeof statusConfig];

    return (
      <Card className="bg-card-gradient border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Shield className="mr-2 h-5 w-5" />
              Account Status
            </CardTitle>
            <Badge variant={config.color as any} className="text-xs">
              {config.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-3">
            {config.description}
          </p>
          {stats.verificationStatus !== 'verified' && (
            <Button size="sm" variant="outline" className="text-xs">
              Complete Verification
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your DAILI community today.
        </p>
      </div>

      {/* Verification Status */}
      {verificationCard()}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card-gradient hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
            <ShoppingBag className="h-4 w-4 text-ghana-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
            <Users className="h-4 w-4 text-ghana-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.posts}</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-card transition-shadow"
                onClick={action.action}
              >
                <action.icon className={`h-8 w-8 text-${action.color}`} />
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Section */}
      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Trending in Ghana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Star className="h-4 w-4 text-ghana-gold" />
                <span className="font-medium">#GhanaStartups</span>
              </div>
              <Badge variant="secondary">2.5k posts</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Star className="h-4 w-4 text-ghana-gold" />
                <span className="font-medium">#AccraMarketplace</span>
              </div>
              <Badge variant="secondary">1.8k posts</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Star className="h-4 w-4 text-ghana-gold" />
                <span className="font-medium">#DigitalGhana</span>
              </div>
              <Badge variant="secondary">1.2k posts</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;