
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Phone, User } from 'lucide-react';
import farmersData from '../data/farmers.json';

const Farmers = () => {
  const { t } = useLanguage();
  const [farmersData, setFarmersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        console.log('Fetching farmers data...');
        const response = await fetch('/api/farmers');
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Farmers data result:', result);
        if (result.success) {
          setFarmersData(result.data);
        } else {
          console.error("Error in response:", result.message);
          // Fallback to static data
          setFarmersData(farmersData);
        }
      } catch (error) {
        console.error("Error fetching farmers data:", error);
        // Fallback to static data
        setFarmersData(farmersData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('farmers.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Connect with experienced farmers and farm owners across Bangladesh
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading farmers...</p>
          </div>
        )}

        {/* Farmers Grid */}
        {!isLoading && (
          <>
            {farmersData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No farmers found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmersData.map((farmer) => (
                  <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-amber-100 to-green-100 rounded-t-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{farmer.name}</CardTitle>
                      <p className="text-green-600 font-medium">{farmer.farmName}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{farmer.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{farmer.mobile}</span>
                        </div>
                        
                        <div className="pt-2">
                          <Badge variant="outline" className="mb-2">
                            {farmer.speciality}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <p><strong>Experience:</strong> {farmer.experience}</p>
                            <p><strong>Livestock:</strong> {farmer.livestock}</p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                        Contact Farmer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Farmers;
