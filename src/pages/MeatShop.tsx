
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Plus, Minus } from 'lucide-react';

const MeatShop = () => {
  const { t } = useLanguage();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const meatItems = [
    {
      id: 1,
      name: 'Premium Beef',
      price: '৳650/kg',
      description: 'Fresh premium quality beef from local farms',
      halal: true,
      available: true
    },
    {
      id: 2,
      name: 'Mutton (Goat)',
      price: '৳850/kg',
      description: 'Fresh mutton from healthy goats',
      halal: true,
      available: true
    },
    {
      id: 3,
      name: 'Chicken (Broiler)',
      price: '৳180/kg',
      description: 'Farm fresh broiler chicken',
      halal: true,
      available: true
    },
    {
      id: 4,
      name: 'Beef Bone',
      price: '৳250/kg',
      description: 'Fresh beef bones for curry and soup',
      halal: true,
      available: true
    },
    {
      id: 5,
      name: 'Buffalo Meat',
      price: '৳550/kg',
      description: 'High quality buffalo meat',
      halal: true,
      available: false
    },
    {
      id: 6,
      name: 'Liver (Beef)',
      price: '৳400/kg',
      description: 'Fresh beef liver, rich in nutrients',
      halal: true,
      available: true
    }
  ];

  const updateQuantity = (id: number, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change)
    }));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('meat.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Fresh halal meat products delivered to your doorstep
          </p>
          <div className="flex justify-center mt-4">
            <Badge className="bg-green-600 text-white px-4 py-2">
              ✓ 100% Halal Certified
            </Badge>
          </div>
        </div>

        {/* Meat Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meatItems.map((item) => (
            <Card key={item.id} className={`hover:shadow-lg transition-shadow ${!item.available ? 'opacity-75' : ''}`}>
              <div className="h-40 bg-gradient-to-br from-red-100 to-orange-100 rounded-t-lg flex items-center justify-center relative">
                <div className="text-5xl">🥩</div>
                {item.halal && (
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    Halal
                  </Badge>
                )}
                {!item.available && (
                  <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <div className="text-xl font-bold text-red-600">{item.price}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                {item.available && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quantity (kg):</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -0.5)}
                          disabled={!quantities[item.id]}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">
                          {quantities[item.id] || 0}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 0.5)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={!quantities[item.id]}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
                
                {!item.available && (
                  <Button className="w-full" disabled>
                    Currently Unavailable
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4">Why Choose Our Halal Meat?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🕌</div>
              <h4 className="font-medium mb-1">100% Halal</h4>
              <p className="text-gray-600">Certified halal slaughter according to Islamic principles</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚚</div>
              <h4 className="font-medium mb-1">Fresh Delivery</h4>
              <p className="text-gray-600">Same day delivery to ensure maximum freshness</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⭐</div>
              <h4 className="font-medium mb-1">Premium Quality</h4>
              <p className="text-gray-600">Sourced from healthy, well-fed livestock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeatShop;
