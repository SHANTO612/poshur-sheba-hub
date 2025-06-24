
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Phone, User } from 'lucide-react';
import farmersData from '../data/farmers.json';

const Farmers = () => {
  const { t } = useLanguage();

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

        {/* Farmers Grid */}
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
      </div>
    </div>
  );
};

export default Farmers;
