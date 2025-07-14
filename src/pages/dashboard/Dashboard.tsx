import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  User, 
  Dog, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Star,
  TrendingUp,
  Edit,
  Store,
  ShoppingBag,
  Activity,
  Package,
  Users,
  Zap,
  Trash2,
  UserX,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AddCattleDialog from '../../components/business/cattle/AddCattleDialog';
import AddProductDialog from '../../components/business/products/AddProductDialog';
import PatientRecords from '../../components/business/appointments/PatientRecords';
import { toast } from '../../components/ui/sonner';
import apiService from '../../services/api';

interface Cattle {
  _id: string;
  name: string;
  breed: string;
  type: string;
  price: string;
  status: string;
  images: Array<{ url: string }>;
  createdAt: string;
  views?: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  type: string;
  price: string;
  available: boolean;
  images: Array<{ url: string }>;
  createdAt: string;
}

const Dashboard = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [myCattle, setMyCattle] = useState<Cattle[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCattle: 0,
    availableCattle: 0,
    soldCattle: 0,
    totalViews: 0,
    totalProducts: 0,
    availableProducts: 0,
    todayAppointments: 0,
    weekAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0
  });

  // 1. Import necessary hooks and components from Admin.tsx
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminCattle, setAdminCattle] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminRatings, setAdminRatings] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);
  const [adminDeleteLoading, setAdminDeleteLoading] = useState({});
  const [adminActiveTab, setAdminActiveTab] = useState('users');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    if (user && token) {
      fetchUserData();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      if (user?.userType === 'farmer') {
        await fetchMyCattle();
      } else if (user?.userType === 'seller') {
        await fetchMyProducts();
      } else if (user?.userType === 'veterinarian') {
        await fetchAppointmentStats();
      } else if (user?.userType === 'admin') {
        await fetchAdminData();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCattle = async () => {
    try {
      const response = await apiService.get('/cattle/my/listings', token);
      
      if (response.success) {
        const cattleData = (response.data || []) as Cattle[];
        setMyCattle(cattleData);
        
        // Calculate stats
        const total = cattleData.length || 0;
        const available = cattleData.filter((cattle: Cattle) => cattle.status === 'available').length || 0;
        const sold = cattleData.filter((cattle: Cattle) => cattle.status === 'sold').length || 0;
        const views = cattleData.reduce((sum: number, cattle: Cattle) => sum + (cattle.views || 0), 0) || 0;
        
        setStats({
          totalCattle: total,
          availableCattle: available,
          soldCattle: sold,
          totalViews: views,
          totalProducts: 0,
          availableProducts: 0,
          todayAppointments: 0,
          weekAppointments: 0,
          totalPatients: 0,
          pendingAppointments: 0
        });
      }
    } catch (error) {
      console.error('Error fetching cattle:', error);
      toast.error('Failed to load your cattle listings');
    }
  };

  const fetchMyProducts = async () => {
    try {
      const response = await apiService.get('/products/my/products', token);
      
      if (response.success) {
        const productData = (response.data || []) as Product[];
        setMyProducts(productData);
        
        // Calculate stats
        const total = productData.length || 0;
        const available = productData.filter((product: Product) => product.available).length || 0;
        
        setStats({
          totalCattle: 0,
          availableCattle: 0,
          soldCattle: 0,
          totalViews: 0,
          totalProducts: total,
          availableProducts: available,
          todayAppointments: 0,
          weekAppointments: 0,
          totalPatients: 0,
          pendingAppointments: 0
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load your product listings');
    }
  };

  const handleCattleAdded = () => {
    fetchMyCattle();
    toast.success('Cattle listing added successfully!');
  };

  const handleProductAdded = () => {
    fetchMyProducts();
    toast.success('Product added successfully!');
  };

  const fetchAppointmentStats = async () => {
    try {
      const response = await apiService.get('/appointments/stats', token);
      
      if (response.success) {
        const statsData = response.data as {
          todayAppointments: number;
          weekAppointments: number;
          totalPatients: number;
          pendingAppointments: number;
        };
        setStats(prev => ({
          ...prev,
          todayAppointments: statsData.todayAppointments || 0,
          weekAppointments: statsData.weekAppointments || 0,
          totalPatients: statsData.totalPatients || 0,
          pendingAppointments: statsData.pendingAppointments || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
    }
  };

  // 3. Add admin data fetching
  const fetchAdminData = async () => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      const [statsRes, usersRes, cattleRes, productsRes, ratingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/cattle`),
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/ratings`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (statsRes.ok) setAdminStats((await statsRes.json()).data);
      if (usersRes.ok) setAdminUsers((await usersRes.json()).data || []);
      if (cattleRes.ok) setAdminCattle((await cattleRes.json()).data || []);
      if (productsRes.ok) setAdminProducts((await productsRes.json()).data || []);
      if (ratingsRes.ok) setAdminRatings((await ratingsRes.json()).data || []);
    } catch (error) {
      setAdminError('Failed to load admin data');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminDelete = async (type, id, name) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      setAdminDeleteLoading(prev => ({ ...prev, [id]: true }));
      const response = await fetch(`${API_BASE_URL}/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success(`${type} deleted successfully!`);
        fetchAdminData();
      } else {
        toast.error(result.message || `Failed to delete ${type}`);
      }
    } catch (error) {
      toast.error(`Failed to delete ${type}. Please try again.`);
    } finally {
      setAdminDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Please login to access your dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'seller': return 'bg-red-100 text-red-800';
      case 'veterinarian': return 'bg-blue-100 text-blue-800';
      case 'buyer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'farmer': return <Dog className="h-5 w-5" />;
      case 'seller': return <Store className="h-5 w-5" />;
      case 'veterinarian': return <Activity className="h-5 w-5" />;
      case 'buyer': return <ShoppingBag className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const renderStatsCards = () => {
    if (user?.userType === 'farmer') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cattle</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCattle}</p>
                </div>
                <Dog className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.availableCattle}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-green-600">{stats.soldCattle}</p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else if (user?.userType === 'seller') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableProducts}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shop</p>
                  <p className="text-2xl font-bold text-blue-600">{user.shopName || 'N/A'}</p>
                </div>
                <Store className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else if (user?.userType === 'veterinarian') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clinic</p>
                  <p className="text-2xl font-bold text-blue-600">{user.clinicName || 'N/A'}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Specialization</p>
                  <p className="text-2xl font-bold text-green-600">{user.specialization || 'N/A'}</p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">License</p>
                  <p className="text-2xl font-bold text-purple-600">{user.licenseNumber || 'N/A'}</p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Availability</p>
                  <p className="text-2xl font-bold text-orange-600">{user.availability || 'N/A'}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return null;
  };

  const renderContentSection = () => {
    if (user?.userType === 'farmer') {
      return (
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Dog className="h-5 w-5" />
                  My Cattle Listings
                </CardTitle>
                <AddCattleDialog onCattleAdded={handleCattleAdded} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your cattle...</p>
                </div>
              ) : myCattle.length === 0 ? (
                <div className="text-center py-8">
                  <Dog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cattle listings yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding your first cattle listing to begin selling
                  </p>
                  <AddCattleDialog onCattleAdded={handleCattleAdded} />
                </div>
              ) : (
                <div className="space-y-4">
                  {myCattle.map((cattle) => (
                    <div key={cattle._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            {cattle.images && cattle.images.length > 0 ? (
                              <img 
                                src={cattle.images[0].url} 
                                alt={cattle.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Dog className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{cattle.name}</h3>
                            <p className="text-gray-600">{cattle.breed} • {cattle.type}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={cattle.status === 'available' ? 'default' : 'secondary'}>
                                {cattle.status}
                              </Badge>
                              <span className="text-green-600 font-semibold">{cattle.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Listed {new Date(cattle.createdAt).toLocaleDateString()}
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    } else if (user?.userType === 'seller') {
      return (
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  My Product Listings
                </CardTitle>
                <AddProductDialog onProductAdded={handleProductAdded} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your products...</p>
                </div>
              ) : myProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No product listings yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding your first product to begin selling
                  </p>
                  <AddProductDialog onProductAdded={handleProductAdded} />
                </div>
              ) : (
                <div className="space-y-4">
                  {myProducts.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0].url} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-gray-600">{product.category} • {product.type}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={product.available ? 'default' : 'secondary'}>
                                {product.available ? 'Available' : 'Out of Stock'}
                              </Badge>
                              <span className="text-red-600 font-semibold">{product.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Listed {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    } else if (user?.userType === 'veterinarian') {
      return (
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Professional Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="h-20 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://calendar.google.com', '_blank')}
                >
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Appointment Calendar</p>
                    <p className="text-xs opacity-90">Manage Schedule</p>
                  </div>
                </Button>
                <PatientRecords />
                <Button 
                  className="h-20 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => toast.success('Profile update feature coming soon!')}
                >
                  <div className="text-center">
                    <Star className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Update Profile</p>
                    <p className="text-xs opacity-90">Edit Information</p>
                  </div>
                </Button>
                <Button 
                  className="h-20 bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => window.open(`tel:${user.phone}`, '_blank')}
                >
                  <div className="text-center">
                    <Phone className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Emergency Line</p>
                    <p className="text-xs opacity-90">24/7 Available</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Practice Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Practice Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.todayAppointments}</div>
                    <div className="text-sm text-gray-600">Today's Appointments</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.weekAppointments}</div>
                    <div className="text-sm text-gray-600">This Week</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalPatients}</div>
                    <div className="text-sm text-gray-600">Total Patients</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast.success('Add patient feature coming soon!')}
                    >
                      Add Patient
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('https://calendar.google.com', '_blank')}
                    >
                      Schedule Visit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast.success('Reports feature coming soon!')}
                    >
                      View Reports
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast.success('Update availability feature coming soon!')}
                    >
                      Update Availability
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      );
    }
    return null;
  };

  if (user?.userType === 'admin') {
    if (adminLoading) {
      return <div className="min-h-screen py-8 text-center">Loading admin dashboard...</div>;
    }
    if (adminError) {
      return <div className="min-h-screen py-8 text-center text-red-500">{adminError}</div>;
    }
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, content, and monitor platform activity</p>
          </div>
          {/* Stats Cards */}
          {adminStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.totalUsers}</div></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Cattle Listings</CardTitle><Zap className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.totalCattle}</div></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Products</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.totalProducts}</div></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Ratings</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.totalRatings}</div></CardContent></Card>
            </div>
          )}
          {/* Management Tabs */}
          <Card className="mb-8">
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Content Management</CardTitle></CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-6">
                <Button variant={adminActiveTab === 'users' ? 'default' : 'outline'} onClick={() => setAdminActiveTab('users')}>Users ({adminUsers.length})</Button>
                <Button variant={adminActiveTab === 'cattle' ? 'default' : 'outline'} onClick={() => setAdminActiveTab('cattle')}>Cattle ({adminCattle.length})</Button>
                <Button variant={adminActiveTab === 'products' ? 'default' : 'outline'} onClick={() => setAdminActiveTab('products')}>Products ({adminProducts.length})</Button>
                <Button variant={adminActiveTab === 'ratings' ? 'default' : 'outline'} onClick={() => setAdminActiveTab('ratings')}>Ratings ({adminRatings.length})</Button>
              </div>
              {/* Users Tab */}
              {adminActiveTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="w-full"><thead><tr className="border-b"><th className="text-left py-2">Name</th><th className="text-left py-2">Email</th><th className="text-left py-2">Phone</th><th className="text-left py-2">Type</th><th className="text-left py-2">Status</th><th className="text-left py-2">Joined</th><th className="text-left py-2">Actions</th></tr></thead><tbody>{adminUsers.map((u) => (<tr key={u._id} className="border-b hover:bg-gray-50"><td className="py-2">{u.name}</td><td className="py-2">{u.email}</td><td className="py-2">{u.phone || 'N/A'}</td><td className="py-2"><Badge variant={u.userType === 'admin' ? 'destructive' : 'secondary'}>{u.userType}</Badge></td><td className="py-2">{u.isActive ? (<CheckCircle className="h-4 w-4 text-green-500" />) : (<XCircle className="h-4 w-4 text-red-500" />)}</td><td className="py-2">{new Date(u.createdAt).toLocaleDateString()}</td><td className="py-2">{u.userType !== 'admin' && (<Button variant="destructive" size="sm" onClick={() => handleAdminDelete('users', u._id, u.name)} disabled={adminDeleteLoading[u._id]}>{adminDeleteLoading[u._id] ? 'Deleting...' : (<><Trash2 className="h-4 w-4 mr-1" />Delete</>)}</Button>)}</td></tr>))}</tbody></table>
                </div>
              )}
              {/* Cattle Tab */}
              {adminActiveTab === 'cattle' && (
                <div className="overflow-x-auto">
                  <table className="w-full"><thead><tr className="border-b"><th className="text-left py-2">Name</th><th className="text-left py-2">Breed</th><th className="text-left py-2">Price</th><th className="text-left py-2">Seller</th><th className="text-left py-2">Actions</th></tr></thead><tbody>{adminCattle.map((c) => (<tr key={c._id} className="border-b hover:bg-gray-50"><td className="py-2">{c.name}</td><td className="py-2">{c.breed}</td><td className="py-2">{c.price}</td><td className="py-2">{c.seller?.name || 'Unknown'}</td><td className="py-2"><Button variant="destructive" size="sm" onClick={() => handleAdminDelete('cattle', c._id, c.name)} disabled={adminDeleteLoading[c._id]}>{adminDeleteLoading[c._id] ? 'Deleting...' : (<><Trash2 className="h-4 w-4 mr-1" />Delete</>)}</Button></td></tr>))}</tbody></table>
                </div>
              )}
              {/* Products Tab */}
              {adminActiveTab === 'products' && (
                <div className="overflow-x-auto">
                  <table className="w-full"><thead><tr className="border-b"><th className="text-left py-2">Name</th><th className="text-left py-2">Category</th><th className="text-left py-2">Price</th><th className="text-left py-2">Seller</th><th className="text-left py-2">Actions</th></tr></thead><tbody>{adminProducts.map((p) => (<tr key={p._id} className="border-b hover:bg-gray-50"><td className="py-2">{p.name}</td><td className="py-2">{p.category}</td><td className="py-2">{p.price}</td><td className="py-2">{p.seller?.name || 'Unknown'}</td><td className="py-2"><Button variant="destructive" size="sm" onClick={() => handleAdminDelete('products', p._id, p.name)} disabled={adminDeleteLoading[p._id]}>{adminDeleteLoading[p._id] ? 'Deleting...' : (<><Trash2 className="h-4 w-4 mr-1" />Delete</>)}</Button></td></tr>))}</tbody></table>
                </div>
              )}
              {/* Ratings Tab */}
              {adminActiveTab === 'ratings' && (
                <div className="overflow-x-auto">
                  <table className="w-full"><thead><tr className="border-b"><th className="text-left py-2">Farmer</th><th className="text-left py-2">Veterinarian</th><th className="text-left py-2">Rating</th><th className="text-left py-2">Actions</th></tr></thead><tbody>{adminRatings.map((r) => (<tr key={r._id} className="border-b hover:bg-gray-50"><td className="py-2">{r.farmer?.name || 'Unknown'}</td><td className="py-2">{r.veterinarian?.name || 'Unknown'}</td><td className="py-2">{r.rating}/5</td><td className="py-2"><Button variant="destructive" size="sm" onClick={() => handleAdminDelete('ratings', r._id, 'rating')} disabled={adminDeleteLoading[r._id]}>{adminDeleteLoading[r._id] ? 'Deleting...' : (<><Trash2 className="h-4 w-4 mr-1" />Delete</>)}</Button></td></tr>))}</tbody></table>
                </div>
              )}
            </CardContent>
          </Card>
          {/* User Type Breakdown */}
          {adminStats && adminStats.userTypes && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card><CardHeader><CardTitle className="text-sm">Farmers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.userTypes.farmers}</div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm">Sellers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.userTypes.sellers}</div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm">Veterinarians</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.userTypes.veterinarians}</div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm">Buyers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.userTypes.buyers}</div></CardContent></Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Manage your {user.userType === 'farmer' ? 'cattle listings' : user.userType === 'seller' ? 'product listings' : 'profile'}
          </p>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || ''} />
                    <AvatarFallback className={getUserTypeColor(user.userType)}>
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <Badge className={getUserTypeColor(user.userType)}>
                      {user.userType}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{user.phone}</span>
                  </div>

                  {user.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{user.location}</span>
                    </div>
                  )}

                  {user.farmName && (
                    <div className="flex items-center gap-2 text-sm">
                      <Dog className="h-4 w-4 text-gray-500" />
                      <span>{user.farmName}</span>
                    </div>
                  )}

                  {user.shopName && (
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="h-4 w-4 text-gray-500" />
                      <span>{user.shopName}</span>
                    </div>
                  )}

                  {user.clinicName && (
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span>{user.clinicName}</span>
                    </div>
                  )}

                  {user.speciality && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span>{user.speciality}</span>
                    </div>
                  )}

                  {user.experience && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{user.experience} experience</span>
                    </div>
                  )}

                  {user.description && (
                    <div className="text-sm">
                      <p className="font-medium text-gray-700 mb-1">About:</p>
                      <p className="text-gray-600 leading-relaxed">{user.description}</p>
                    </div>
                  )}

                  {user.userType === 'farmer' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Dog className="h-4 w-4 text-gray-500" />
                      <span>{stats.totalCattle} Cattle Listings</span>
                    </div>
                  )}

                  {user.userType === 'seller' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span>{stats.totalProducts} Product Listings</span>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Content Section */}
          {renderContentSection()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 