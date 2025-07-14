
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  Zap, 
  Package, 
  Star, 
  Trash2, 
  UserX,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from '../../components/ui/sonner';

const Admin = () => {
  const { user, isAuthenticated, token, isLoading } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [cattle, setCattle] = useState([]);
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [activeTab, setActiveTab] = useState('users');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    
    if (!isAuthenticated || user?.userType !== 'admin') {
      setError('Admin access required');
      setLoading(false);
      return;
    }

    // Clear any previous error when authentication succeeds
    setError(null);

    fetchAdminData();
  }, [isAuthenticated, user]);

  // Show loading while auth context is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, usersRes, cattleRes, productsRes, ratingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/cattle`),
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/ratings`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      } else {
        console.error('Stats response error:', statsRes.status, await statsRes.text());
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data);
      } else {
        console.error('Users response error:', usersRes.status, await usersRes.text());
      }

      if (cattleRes.ok) {
        const cattleData = await cattleRes.json();
        setCattle(cattleData.data || []);
      } else {
        console.error('Cattle response error:', cattleRes.status, await cattleRes.text());
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.data || []);
      } else {
        console.error('Products response error:', productsRes.status, await productsRes.text());
      }

      if (ratingsRes.ok) {
        const ratingsData = await ratingsRes.json();
        setRatings(ratingsData.data || []);
      } else {
        console.error('Ratings response error:', ratingsRes.status, await ratingsRes.text());
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id, name) => {
    console.log('Delete requested:', { type, id, name });
    
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      setDeleteLoading(prev => ({ ...prev, [id]: true }));
      console.log('Sending delete request to:', `${API_BASE_URL}/admin/${type}/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Delete response status:', response.status);
      const result = await response.json();
      console.log('Delete response:', result);

      if (response.ok && result.success) {
        toast.success(`${type} deleted successfully!`);
        fetchAdminData(); // Refresh data
      } else {
        toast.error(result.message || `Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}. Please try again.`);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (!isAuthenticated || user?.userType !== 'admin') {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">Admin access required to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && (!isAuthenticated || user?.userType !== 'admin')) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, content, and monitor platform activity</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cattle Listings</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCattle}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ratings</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRatings}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Content Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Button
                variant={activeTab === 'users' ? 'default' : 'outline'}
                onClick={() => setActiveTab('users')}
              >
                Users ({users.length})
              </Button>
              <Button
                variant={activeTab === 'cattle' ? 'default' : 'outline'}
                onClick={() => setActiveTab('cattle')}
              >
                Cattle ({cattle.length})
              </Button>
              <Button
                variant={activeTab === 'products' ? 'default' : 'outline'}
                onClick={() => setActiveTab('products')}
              >
                Products ({products.length})
              </Button>
              <Button
                variant={activeTab === 'ratings' ? 'default' : 'outline'}
                onClick={() => setActiveTab('ratings')}
              >
                Ratings ({ratings.length})
              </Button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Phone</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Joined</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{user.name}</td>
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">{user.phone || 'N/A'}</td>
                        <td className="py-2">
                          <Badge variant={user.userType === 'admin' ? 'destructive' : 'secondary'}>
                            {user.userType}
                          </Badge>
                        </td>
                        <td className="py-2">
                          {user.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </td>
                        <td className="py-2">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          {user.userType !== 'admin' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete('users', user._id, user.name)}
                              disabled={deleteLoading[user._id]}
                            >
                              {deleteLoading[user._id] ? (
                                'Deleting...'
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cattle Tab */}
            {activeTab === 'cattle' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Breed</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Seller</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cattle.map((cattleItem) => (
                      <tr key={cattleItem._id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{cattleItem.name}</td>
                        <td className="py-2">{cattleItem.breed}</td>
                        <td className="py-2">{cattleItem.price}</td>
                        <td className="py-2">{cattleItem.seller?.name || 'Unknown'}</td>
                        <td className="py-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete('cattle', cattleItem._id, cattleItem.name)}
                            disabled={deleteLoading[cattleItem._id]}
                          >
                            {deleteLoading[cattleItem._id] ? (
                              'Deleting...'
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Seller</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{product.name}</td>
                        <td className="py-2">{product.category}</td>
                        <td className="py-2">{product.price}</td>
                        <td className="py-2">{product.seller?.name || 'Unknown'}</td>
                        <td className="py-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete('products', product._id, product.name)}
                            disabled={deleteLoading[product._id]}
                          >
                            {deleteLoading[product._id] ? (
                              'Deleting...'
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Ratings Tab */}
            {activeTab === 'ratings' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Farmer</th>
                      <th className="text-left py-2">Veterinarian</th>
                      <th className="text-left py-2">Rating</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((rating) => (
                      <tr key={rating._id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{rating.farmer?.name || 'Unknown'}</td>
                        <td className="py-2">{rating.veterinarian?.name || 'Unknown'}</td>
                        <td className="py-2">{rating.rating}/5</td>
                        <td className="py-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete('ratings', rating._id, 'rating')}
                            disabled={deleteLoading[rating._id]}
                          >
                            {deleteLoading[rating._id] ? (
                              'Deleting...'
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Type Breakdown */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Farmers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.userTypes.farmers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.userTypes.sellers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Veterinarians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.userTypes.veterinarians}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Buyers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.userTypes.buyers}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
