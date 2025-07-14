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
  Edit
} from 'lucide-react';
import AddCattleDialog from '../../components/business/cattle/AddCattleDialog';
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

const FarmerDashboard = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [myCattle, setMyCattle] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCattle: 0,
    availableCattle: 0,
    soldCattle: 0,
    totalViews: 0
  });

  useEffect(() => {
    if (user && token) {
      fetchMyCattle();
    }
  }, [user, token]);

  const fetchMyCattle = async () => {
    try {
      setLoading(true);
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
          totalViews: views
        });
      }
    } catch (error) {
      console.error('Error fetching cattle:', error);
      toast.error('Failed to load your cattle listings');
    } finally {
      setLoading(false);
    }
  };

  const handleCattleAdded = () => {
    fetchMyCattle();
    toast.success('Cattle listing added successfully!');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Manage your cattle listings and profile
          </p>
        </div>

        {/* Stats Cards */}
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
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <Badge variant="secondary">{user.userType}</Badge>
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

                  <div className="flex items-center gap-2 text-sm">
                    <Dog className="h-4 w-4 text-gray-500" />
                    <span>{stats.totalCattle} Cattle Listings</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cattle Management */}
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
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard; 