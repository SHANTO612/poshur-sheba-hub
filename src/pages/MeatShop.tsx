
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Minus, MapPin, Phone, Store, Search, Filter, Trash2 } from 'lucide-react';
import AddProductDialog from '../components/AddProductDialog';
import Cart from '../components/Cart';
import { toast } from '../components/ui/sonner';

const MeatShop = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, token } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and sellers in parallel
        const [productsResponse, sellersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/sellers`)
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
    fetch(`${API_BASE_URL}/products`)
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

  const handleProductDeleted = () => {
    // Refresh products when one is deleted
    fetch(`${API_BASE_URL}/products`)
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

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Product deleted successfully!');
        handleProductDeleted();
      } else {
        toast.error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
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

  const halalMeatCategories = [
    'beef', 'mutton', 'chicken', 'buffalo', 'organ', 'bone'
  ];

  const filteredProducts = products.filter(product => {
    const matchesSection = halalMeatCategories.includes(product.category);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSeller = selectedSeller === 'all' || product.seller?._id === selectedSeller;
    
    return matchesSection && matchesSearch && matchesCategory && matchesSeller;
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading meat shop...</p>
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
            {t('meat.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Fresh halal meat and dairy products from trusted sellers
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
                  <SelectItem value="beef">Beef</SelectItem>
                  <SelectItem value="mutton">Mutton</SelectItem>
                  <SelectItem value="chicken">Chicken</SelectItem>
                  <SelectItem value="buffalo">Buffalo</SelectItem>
                  <SelectItem value="organ">Organ</SelectItem>
                  <SelectItem value="bone">Bone</SelectItem>
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

        {/* Sellers Section */}
        {sellers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trusted Sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellers.map((seller) => (
                <Card key={seller._id} className="hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-t-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <Store className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{seller.name}</CardTitle>
                    <p className="text-red-600 font-medium">{seller.shopName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{seller.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{seller.phone}</span>
                      </div>
                      
                      <div className="pt-2">
                        <Badge variant="outline" className="mb-2">
                          {seller.businessType}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          <p><strong>Rating:</strong> ⭐ {seller.rating}/5</p>
                          <p><strong>Total Sales:</strong> {seller.totalSales}</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      Contact Seller
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Products</h2>
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product._id} className="hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 rounded-t-lg overflow-hidden">
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
                      <div className="text-6xl">🥩</div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="secondary">{product.halal ? 'Halal' : 'Non-Halal'}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{product.seller?.shopName}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-red-600">{product.price}</span>
                      <span className={`text-sm ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                        {product.available ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {product.available && (
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    )}
                    {/* Edit and Delete buttons for seller */}
                    {isAuthenticated && user?._id === product.seller?._id && (
                      <div className="flex gap-2 mt-2">
                        <AddProductDialog
                          product={product}
                          onProductUpdated={handleProductAdded}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeatShop;
