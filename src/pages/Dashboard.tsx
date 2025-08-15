import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Settings, 
  Home,
  Bell,
  Search,
  Plus,
  Shield,
  LogOut
} from 'lucide-react';
import Chat from '@/components/Chat';
import Marketplace from '@/components/Marketplace';
import Social from '@/components/Social';
import Profile from '@/components/Profile';
import DashboardHome from '@/components/DashboardHome';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  phone_number: string;
  date_of_birth: string;
  location: string;
  bio: string;
  verification_status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'chat':
        return <Chat />;
      case 'marketplace':
        return <Marketplace />;
      case 'social':
        return <Social />;
      case 'profile':
        return <Profile profile={profile} onProfileUpdate={fetchProfile} />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">DAILI</h2>
                <p className="text-xs text-muted-foreground">Super-App</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="flex-1">
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {profile?.full_name || 'Loading...'}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-muted-foreground truncate">
                      @{profile?.username}
                    </p>
                    {profile?.verification_status === 'verified' && (
                      <Badge variant="secondary" className="bg-ghana-green text-ghana-green-foreground text-xs px-1 py-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <SidebarMenu className="p-2">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full justify-start ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search DAILI..."
                    className="bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;