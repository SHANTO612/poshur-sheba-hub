
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Filter } from 'lucide-react';
import AddProductDialog from '../components/AddProductDialog';
import Cart from '../components/Cart';
import { toast } from '../components/ui/sonner';

const Feed = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('feed');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch feed and equipment products and sellers in parallel
        const [productsResponse, sellersResponse] = await Promise.all([
          fetch('/api/products?type=feed,equipment'),
          fetch('/api/sellers')
        ]);

        const productsResult = await productsResponse.json();
        const sellersResult = await sellersResponse.json();

        if (productsResult.success) {
          setProducts(productsResult.data);
        } else {
          console.error("Error fetching products:", productsResult.message);
        }

        if (sellersResult.success) {
          setSellers(sellersResult.data);
        } else {
          console.error("Error fetching sellers:", sellersResult.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Could not connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProductAdded = () => {
    // Refresh products when a new one is added
    fetch('/api/products?type=feed,equipment')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setProducts(result.data);
        }
      })
      .catch(error => {
        console.error("Error refreshing products:", error);
      });
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      priceNumeric: product.priceNumeric,
      quantity: 1,
      image: product.images?.[0]?.url,
      seller: {
        name: product.seller?.name || 'Unknown',
        shopName: product.seller?.shopName || 'Unknown Shop'
      }
    });

    toast.success(`${product.name} added to cart!`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSeller = selectedSeller === 'all' || product.seller?._id === selectedSeller;
    const matchesTab = activeTab === 'feed' ? product.type === 'feed' : product.type === 'equipment';
    
    return matchesSearch && matchesCategory && matchesSeller && matchesTab;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.priceNumeric - b.priceNumeric;
      case 'price_high':
        return b.priceNumeric - a.priceNumeric;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading feed and equipment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('feed.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Quality feed and equipment for your livestock needs
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="feed">Feed</SelectItem>
                  <SelectItem value="supplement">Supplement</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                  <SelectItem value="machine">Machine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-48">
              <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                <SelectTrigger>
                  <SelectValue placeholder="Seller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sellers</SelectItem>
                  {sellers.map(seller => (
                    <SelectItem key={seller._id} value={seller._id}>
                      {seller.shopName || seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {isAuthenticated && user?.userType === 'seller' && (
                <AddProductDialog onProductAdded={handleProductAdded} />
              )}
              <Cart />
            </div>
          </div>
        </div>

        {/* Tabs for Feed and Equipment */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="feed">Feed & Supplements</TabsTrigger>
            <TabsTrigger value="equipment">Equipment & Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Feed & Supplements</h2>
              {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No feed products found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <Card key={product._id} className="hover:shadow-lg transition-shadow">
                      <div className="h-40 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-5xl">🌾</div>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600 font-medium">{product.seller?.shopName || 'Unknown Shop'}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-orange-600">{product.price}</span>
                          <span className="text-sm text-gray-500">{product.unit}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        
                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-sm ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                            {product.available ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {product.stock > 0 && (
                            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                          )}
                        </div>

                        {product.available && (
                          <Button 
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </Button>
                        )}
                        {/* Edit button for seller */}
                        {isAuthenticated && user?._id === product.seller?._id && (
                          <AddProductDialog
                            product={product}
                            onProductUpdated={handleProductAdded}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Equipment & Tools</h2>
              {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No equipment products found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <Card key={product._id} className="hover:shadow-lg transition-shadow">
                      <div className="h-40 bg-gradient-to-br from-gray-100 to-slate-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-5xl">🔧</div>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600 font-medium">{product.seller?.shopName || 'Unknown Shop'}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-700">{product.price}</span>
                          <span className="text-sm text-gray-500">{product.unit}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        
                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-sm ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                            {product.available ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {product.stock > 0 && (
                            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                          )}
                        </div>

                        {product.available && (
                          <Button 
                            className="w-full bg-gray-700 hover:bg-gray-800"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Information Section */}
        <div className="mt-12 bg-orange-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-800 mb-4">Why Choose Our Products?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-medium mb-1">Quality Assured</h4>
              <p className="text-gray-600">All products meet international standards</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚚</div>
              <h4 className="font-medium mb-1">Fast Delivery</h4>
              <p className="text-gray-600">Quick delivery to your farm</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="font-medium mb-1">Best Prices</h4>
              <p className="text-gray-600">Competitive prices for farmers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
