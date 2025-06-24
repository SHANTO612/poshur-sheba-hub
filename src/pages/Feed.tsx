
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Feed = () => {
  const { t } = useLanguage();

  const feedItems = [
    {
      id: 1,
      name: 'Cattle Feed Mix',
      price: '৳45/kg',
      type: 'feed',
      description: 'Complete nutrition feed for dairy cattle',
      protein: '18%',
      weight: '50kg bag'
    },
    {
      id: 2,
      name: 'Mineral Supplement',
      price: '৳120/kg',
      type: 'feed',
      description: 'Essential minerals and vitamins for livestock',
      protein: 'N/A',
      weight: '25kg bag'
    },
    {
      id: 3,
      name: 'Green Fodder Seeds',
      price: '৳350/kg',
      type: 'feed',
      description: 'High quality fodder seeds for cultivation',
      protein: 'N/A',
      weight: '5kg pack'
    }
  ];

  const equipmentItems = [
    {
      id: 4,
      name: 'Milking Machine',
      price: '৳25,000',
      type: 'equipment',
      description: 'Electric milking machine for efficient milking',
      capacity: '2 cows',
      warranty: '1 year'
    },
    {
      id: 5,
      name: 'Water Trough',
      price: '৳3,500',
      type: 'equipment',
      description: 'Durable plastic water trough for livestock',
      capacity: '200 liters',
      warranty: '6 months'
    },
    {
      id: 6,
      name: 'Feed Mixer',
      price: '৳15,000',
      type: 'equipment',
      description: 'Manual feed mixing machine',
      capacity: '50kg batch',
      warranty: '1 year'
    }
  ];

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

        {/* Tabs for Feed and Equipment */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="feed">Feed & Supplements</TabsTrigger>
            <TabsTrigger value="equipment">Equipment & Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-t-lg flex items-center justify-center">
                    <div className="text-5xl">🌾</div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="text-xl font-bold text-orange-600">{item.price}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      {item.protein !== 'N/A' && (
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <Badge variant="secondary">{item.protein}</Badge>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-medium">{item.weight}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipmentItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-slate-200 rounded-t-lg flex items-center justify-center">
                    <div className="text-5xl">🔧</div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="text-xl font-bold text-gray-700">{item.price}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span className="font-medium">{item.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Warranty:</span>
                        <Badge variant="outline">{item.warranty}</Badge>
                      </div>
                    </div>

                    <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-800">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
