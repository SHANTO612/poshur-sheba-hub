
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Admin = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const adminActions = [
    {
      title: 'Manage Livestock',
      description: 'Add, edit, or remove livestock listings',
      icon: '🐄',
      color: 'bg-green-100 hover:bg-green-200'
    },
    {
      title: 'Add Product',
      description: 'Add new meat, dairy, or feed products',
      icon: '➕',
      color: 'bg-blue-100 hover:bg-blue-200'
    },
    {
      title: 'Manage Farmers',
      description: 'View and manage farmer profiles',
      icon: '👨‍🌾',
      color: 'bg-amber-100 hover:bg-amber-200'
    },
    {
      title: 'View Appointments',
      description: 'Check veterinary appointments',
      icon: '📅',
      color: 'bg-purple-100 hover:bg-purple-200'
    },
    {
      title: 'Order Management',
      description: 'Process meat and dairy orders',
      icon: '📦',
      color: 'bg-red-100 hover:bg-red-200'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: '👥',
      color: 'bg-gray-100 hover:bg-gray-200'
    },
    {
      title: 'Reports & Analytics',
      description: 'View sales and usage reports',
      icon: '📊',
      color: 'bg-teal-100 hover:bg-teal-200'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: '⚙️',
      color: 'bg-orange-100 hover:bg-orange-200'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your Poshur Sheba platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.totalCattle || 0}</div>
              <div className="text-sm text-gray-600">Total Livestock</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.totalFarmers || 0}</div>
              <div className="text-sm text-gray-600">Active Farmers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats?.totalNews || 0}</div>
              <div className="text-sm text-gray-600">News Articles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">৳{stats?.averagePrice || 0}</div>
              <div className="text-sm text-gray-600">Average Price</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminActions.map((action, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all cursor-pointer ${action.color}`}>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{action.icon}</div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <Button size="sm" variant="outline" className="w-full">
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentListings?.map((listing) => (
                  <div key={listing._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">New livestock added by {listing.seller.name}</p>
                      <p className="text-sm text-gray-600">{new Date(listing.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-green-600 text-sm">+1 Cattle</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
