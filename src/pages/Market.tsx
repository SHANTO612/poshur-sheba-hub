
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, MapPin, Phone } from 'lucide-react';
import cattleData from '../data/cattle.json';

const Market = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [filteredCattle, setFilteredCattle] = useState(cattleData);

  const breeds = [...new Set(cattleData.map(cattle => cattle.breed))];

  const handleSearch = () => {
    let filtered = cattleData;

    if (searchTerm) {
      filtered = filtered.filter(cattle => 
        cattle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cattle.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cattle.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBreed !== 'all') {
      filtered = filtered.filter(cattle => cattle.breed === selectedBreed);
    }

    setFilteredCattle(filtered);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('market.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Browse quality livestock from trusted sellers across Bangladesh
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, breed, or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Breeds</SelectItem>
                  {breeds.map(breed => (
                    <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
              Search
            </Button>
          </div>
        </div>

        {/* Cattle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCattle.map((cattle) => (
            <Card key={cattle.id} className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-amber-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐄</div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{cattle.name}</CardTitle>
                  <Badge variant="secondary">{cattle.breed}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{cattle.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{cattle.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-green-600 text-lg">{cattle.price}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Seller Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{cattle.seller}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{cattle.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{cattle.contact}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3">{cattle.description}</p>

                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Contact Seller
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCattle.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No livestock found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
