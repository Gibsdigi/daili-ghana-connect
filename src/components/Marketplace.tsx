import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  Filter,
  Plus,
  ShoppingBag,
  Heart,
  Share,
  Eye,
  MapPin,
  Star
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  condition: string;
  location: string;
  is_featured: boolean;
  views_count: number;
  created_at: string;
  seller_profile: {
    full_name: string;
    username: string;
    avatar_url: string;
    verification_status: string;
  };
  category: {
    name: string;
    icon: string;
  };
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const Marketplace = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('marketplace_products')
        .select(`
          *,
          profiles!marketplace_products_seller_id_fkey (
            full_name,
            username,
            avatar_url,
            verification_status
          ),
          marketplace_categories (
            name,
            icon
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      const productsWithProfiles = data?.map(product => ({
        ...product,
        seller_profile: product.profiles,
        category: product.marketplace_categories
      })) || [];

      setProducts(productsWithProfiles);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency || 'GHS'
    }).format(price);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-GH', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground">Discover amazing products from verified sellers</p>
        </div>
        <Button className="bg-hero-gradient hover:shadow-glow">
          <Plus className="mr-2 h-4 w-4" />
          List Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card-gradient">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <div className="flex overflow-x-auto gap-3 pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="flex-shrink-0"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex-shrink-0"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {selectedCategory 
              ? categories.find(c => c.id === selectedCategory)?.name 
              : 'All Products'
            }
          </h2>
          <p className="text-muted-foreground">{products.length} products found</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="h-80 animate-pulse bg-muted">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted-foreground/20 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted-foreground/20 rounded"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                    <div className="h-6 bg-muted-foreground/20 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or browse different categories
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              List the first product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-card transition-shadow group cursor-pointer bg-card-gradient">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_featured && (
                        <Badge className="bg-ghana-gold text-ghana-gold-foreground text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {product.condition && (
                        <Badge variant="secondary" className="text-xs">
                          {product.condition}
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">
                        {product.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(product.price, product.currency)}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="w-3 h-3 mr-1" />
                        {product.views_count}
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {product.seller_profile?.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium">
                            {product.seller_profile?.full_name}
                          </p>
                          {product.seller_profile?.verification_status === 'verified' && (
                            <Badge variant="secondary" className="text-xs h-4 px-1">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {product.location && (
                          <div className="flex items-center text-xs text-muted-foreground mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {product.location}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(product.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;