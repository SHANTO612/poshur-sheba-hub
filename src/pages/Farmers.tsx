
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Phone, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const Farmers = () => {
  const { t } = useLanguage();
  const [farmersData, setFarmersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching farmers data...');
        const response = await fetch(`${API_BASE_URL}/farmers`);
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Farmers data result:', result);
        if (result.success) {
          setFarmersData(result.data);
        } else {
          console.error("Error in response:", result.message);
          setFarmersData([]);
        }
      } catch (error) {
        console.error("Error fetching farmers data:", error);
        setFarmersData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('farmers.title')}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Loading farmers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('farmers.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Connect with experienced farmers and livestock experts
          </p>
        </div>

        {/* Farmers Grid */}
        {farmersData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No farmers available at the moment.
            </div>
            <p className="text-gray-400">
              Farmers will appear here once they register and add their profiles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmersData.map((farmer) => (
              <Card key={farmer._id || farmer.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-green-800">{farmer.name}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {farmer.rating ? `${farmer.rating}★` : 'New'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{farmer.farmName}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-600">{farmer.location}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-gray-600"><span className="font-medium">Speciality:</span> {farmer.speciality}</p>
                      <p className="text-gray-600"><span className="font-medium">Experience:</span> {farmer.experience}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Livestock:</span> {farmer.livestock}</p>
                    {farmer.totalSales && (
                      <p><span className="font-medium">Total Sales:</span> {farmer.totalSales}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{farmer.mobile}</span>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Contact Farmer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Farmers;
