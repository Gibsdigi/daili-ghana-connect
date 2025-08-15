import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Edit, 
  Shield, 
  Upload,
  Save,
  User,
  Settings,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

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

interface ProfileProps {
  profile: UserProfile | null;
  onProfileUpdate: () => void;
}

const Profile = ({ profile, onProfileUpdate }: ProfileProps) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    phone_number: profile?.phone_number || '',
    date_of_birth: profile?.date_of_birth || '',
    location: profile?.location || '',
    bio: profile?.bio || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          phone_number: formData.phone_number,
          date_of_birth: formData.date_of_birth || null,
          location: formData.location,
          bio: formData.bio
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      onProfileUpdate();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-ghana-green',
          bgColor: 'bg-ghana-green/10',
          borderColor: 'border-ghana-green/20',
          text: 'Verified Account',
          description: 'Your identity has been verified'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          text: 'Verification Rejected',
          description: 'Please resubmit your documents'
        };
      default:
        return {
          icon: Clock,
          color: 'text-ghana-gold',
          bgColor: 'bg-ghana-gold/10',
          borderColor: 'border-ghana-gold/20',
          text: 'Verification Pending',
          description: 'Complete verification to unlock all features'
        };
    }
  };

  const statusConfig = getVerificationStatusConfig(profile?.verification_status || 'pending');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card className="bg-card-gradient">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">{profile?.full_name || 'User'}</h1>
                <div className={`flex items-center px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
                  <statusConfig.icon className={`h-4 w-4 mr-2 ${statusConfig.color}`} />
                  <span className={`text-sm font-medium ${statusConfig.color}`}>
                    {statusConfig.text}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">@{profile?.username}</p>
              <p className="text-sm">{profile?.bio || 'No bio added yet'}</p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Joined {new Date(profile?.created_at || '').toLocaleDateString('en-GH', { month: 'long', year: 'numeric' })}</span>
                {profile?.location && (
                  <span>📍 {profile.location}</span>
                )}
              </div>
            </div>

            <Button
              onClick={() => setEditing(!editing)}
              variant={editing ? "outline" : "default"}
              className={!editing ? "bg-hero-gradient hover:shadow-glow" : ""}
            >
              <Edit className="mr-2 h-4 w-4" />
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-l-4`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Account Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{statusConfig.text}</p>
              <p className="text-sm text-muted-foreground">{statusConfig.description}</p>
            </div>
            {profile?.verification_status !== 'verified' && (
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    disabled={!editing}
                    className={!editing ? 'bg-muted' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    disabled={!editing}
                    className={!editing ? 'bg-muted' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    disabled={!editing}
                    className={!editing ? 'bg-muted' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    disabled={!editing}
                    className={!editing ? 'bg-muted' : ''}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!editing}
                    className={!editing ? 'bg-muted' : ''}
                    placeholder="City, Ghana"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!editing}
                    className={!editing ? 'bg-muted' : ''}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </div>

              {editing && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveProfile}
                    disabled={loading}
                    className="bg-hero-gradient hover:shadow-glow"
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}

              {message && (
                <Alert className={`mt-4 ${message.type === 'error' ? 'border-destructive' : 'border-ghana-green'}`}>
                  <AlertDescription className={message.type === 'error' ? 'text-destructive' : 'text-ghana-green'}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Verify Your Identity</h3>
                <p className="text-muted-foreground mb-4">
                  Upload a government-issued ID to verify your account and unlock all DAILI features
                </p>
                <Button className="bg-hero-gradient hover:shadow-glow">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">Control who can see your profile and posts</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Security</h4>
                    <p className="text-sm text-muted-foreground">Update password and security settings</p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;