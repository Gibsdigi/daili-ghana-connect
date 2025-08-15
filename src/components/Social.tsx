import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Plus,
  Image as ImageIcon,
  Users,
  Globe,
  Shield,
  MoreHorizontal
} from 'lucide-react';

interface Post {
  id: string;
  content: string;
  images: string[];
  post_type: string;
  privacy: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  author_profile: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
    verification_status: string;
  };
}

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  verification_status: string;
}

const Social = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchPosts();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles!social_posts_author_id_fkey (
            id,
            full_name,
            username,
            avatar_url,
            verification_status
          )
        `)
        .eq('privacy', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const postsWithProfiles = data?.map(post => ({
        ...post,
        author_profile: post.profiles
      })) || [];

      setPosts(postsWithProfiles);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const { error } = await supabase
        .from('social_posts')
        .insert({
          author_id: user?.id,
          content: newPost.trim(),
          post_type: 'general',
          privacy: 'public'
        });

      if (error) throw error;

      setNewPost('');
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('post_interactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user?.id)
        .eq('interaction_type', 'like')
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_interactions')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like
        await supabase
          .from('post_interactions')
          .insert({
            post_id: postId,
            user_id: user?.id,
            interaction_type: 'like'
          });
      }

      fetchPosts(); // Refresh to update like counts
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Create Post */}
      <Card className="bg-card-gradient">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userProfile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="border-none bg-transparent resize-none"
                rows={3}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Tag People
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-1" />
                Public
              </div>
              <Button 
                onClick={createPost}
                disabled={!newPost.trim()}
                className="bg-hero-gradient hover:shadow-glow"
              >
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          [...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/6"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
                <div className="h-32 bg-muted rounded mt-4"></div>
              </CardContent>
            </Card>
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share something with the DAILI community!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="bg-card-gradient hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author_profile?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {post.author_profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-sm">
                          {post.author_profile?.full_name}
                        </h3>
                        {post.author_profile?.verification_status === 'verified' && (
                          <Badge variant="secondary" className="bg-ghana-green text-ghana-green-foreground text-xs px-1 py-0">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>@{post.author_profile?.username}</span>
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {post.privacy}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Post Content */}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="grid gap-2">
                      {post.images.length === 1 ? (
                        <img
                          src={post.images[0]}
                          alt="Post content"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {post.images.slice(0, 4).map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Post content ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              {index === 3 && post.images.length > 4 && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    +{post.images.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share className="h-4 w-4 mr-1" />
                        {post.shares_count || 0}
                      </Button>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {post.post_type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Social;