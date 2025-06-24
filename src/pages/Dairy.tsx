
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Dairy = () => {
  const { t } = useLanguage();

  const dairyProducts = [
    {
      id: 1,
      name: 'Fresh Milk',
      price: '৳65/liter',
      volume: '1 liter',
      description: 'Pure fresh milk from local dairy farms',
      organic: true
    },
    {
      id: 2,
      name: 'Yogurt',
      price: '৳45/cup',
      volume: '200g',
      description: 'Creamy homemade yogurt with natural taste',
      organic: false
    },
    {
      id: 3,
      name: 'Pure Ghee',
      price: '৳850/kg',
      volume: '500g',
      description: 'Traditional clarified butter made from cow milk',
      organic: true
    },
    {
      id: 4,
      name: 'Cottage Cheese',
      price: '৳280/kg',
      volume: '250g',
      description: 'Fresh cottage cheese rich in protein',
      organic: false
    },
    {
      id: 5,
      name: 'Butter',
      price: '৳450/kg',
      volume: '200g',
      description: 'Creamy fresh butter made from pure cream',
      organic: true
    },
    {
      id: 6,
      name: 'Cream',
      price: '৳120/cup',
      volume: '150ml',
      description: 'Fresh dairy cream for cooking and desserts',
      organic: false
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('dairy.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Fresh dairy products from trusted local farms
          </p>
        </div>

        {/* Dairy Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dairyProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-blue-100 to-white rounded-t-lg flex items-center justify-center relative">
                <div className="text-5xl">🥛</div>
                {product.organic && (
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    Organic
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">{product.price}</span>
                  <span className="text-sm text-gray-500">{product.volume}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Our Dairy Promise</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🐄</div>
              <h4 className="font-medium mb-1">Farm Fresh</h4>
              <p className="text-gray-600">Direct from our partner dairy farms</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">❄️</div>
              <h4 className="font-medium mb-1">Cold Chain</h4>
              <p className="text-gray-600">Maintained at optimal temperature</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏥</div>
              <h4 className="font-medium mb-1">Quality Tested</h4>
              <p className="text-gray-600">Regular quality and safety checks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dairy;
