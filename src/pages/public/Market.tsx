
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Search, MapPin, Phone, Trash2, MessageSquare, MessageCircle, MoreHorizontal } from 'lucide-react';
import AddCattleDialog from '../../components/business/cattle/AddCattleDialog';
import { toast } from '../../components/ui/sonner';
import AdminContactButtons from '../../components/shared/AdminContactButtons';
import apiService from '../../services/api';
import { Cattle } from '../../types/common';

const Market = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [cattleData, setCattleData] = useState<Cattle[]>([]);
  const [filteredCattle, setFilteredCattle] = useState<Cattle[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({});

  const fetchCattle = async () => {
    try {
      const response = await apiService.get<Cattle[]>('/cattle');
      if (response.success && response.data) {
        setCattleData(response.data);
        setFilteredCattle(response.data);
        const uniqueBreeds = [...new Set(response.data.map(cattle => cattle.breed))];
        setBreeds(uniqueBreeds);
      } else {
        console.error("Error fetching cattle data:", response.message);
        toast.error("Failed to fetch cattle data");
      }
    } catch (error) {
      console.error("Error fetching cattle data:", error);
      toast.error("Failed to fetch cattle data");
    }
  };

  useEffect(() => {
    fetchCattle();
  }, []);

  const handleSearch = () => {
    let filtered = cattleData;

    if (searchTerm) {
      filtered = filtered.filter(cattle =>
        cattle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cattle.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cattle.seller?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBreed !== 'all') {
      filtered = filtered.filter(cattle => cattle.breed === selectedBreed);
    }

    setFilteredCattle(filtered);
  };

  const handleCattleAdded = () => {
    // Refresh the cattle data
    fetchCattle();
  };

  const handleDeleteCattle = async (cattleId: string) => {
    if (!confirm('Are you sure you want to delete this cattle listing? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(prev => ({ ...prev, [cattleId]: true }));
      
      const response = await apiService.delete(`/cattle/${cattleId}`, token);

      if (response.success) {
        toast.success('Cattle listing deleted successfully!');
        fetchCattle(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete cattle listing');
      }
    } catch (error) {
      console.error('Error deleting cattle:', error);
      toast.error('Failed to delete cattle listing. Please try again.');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [cattleId]: false }));
    }
  };

  const canDeleteCattle = (cattle: Cattle) => {
    return isAuthenticated && 
           user?.userType === 'farmer' && 
           cattle.seller._id === user?._id;
  };

  // Admin contact information
  const ADMIN_PHONE = "+8801787935543";
  const ADMIN_NAME = "CattleBes Admin";

  // Contact admin about specific cattle
  const handleContactAdmin = (cattle: Cattle) => {
    const message = `Hello! I'm interested in the ${cattle.name} (${cattle.breed}) listed for ${cattle.price} by ${cattle.seller?.name || 'Unknown Seller'}. Please help me connect with the seller.`;
    
    // WhatsApp
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE.replace(/[\s\-\(\)]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp to contact admin');
  };

  const handleCallAdmin = () => {
    window.open(`tel:${ADMIN_PHONE}`, '_blank');
    toast.success('Initiating call to admin');
  };

  const handleSMSAdmin = (cattle: Cattle) => {
    const message = `Hello! I'm interested in the ${cattle.name} (${cattle.breed}) listed for ${cattle.price} by ${cattle.seller?.name || 'Unknown Seller'}. Please help me connect with the seller.`;
    const smsUrl = `sms:${ADMIN_PHONE}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
    toast.success('Opening SMS to contact admin');
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
            {isAuthenticated && user?.userType === 'farmer' && (
              <AddCattleDialog onCattleAdded={handleCattleAdded} />
            )}
          </div>
        </div>

        {/* Cattle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCattle.map((cattle) => (
            <Card key={cattle._id} className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-amber-100 rounded-t-lg overflow-hidden">
                {cattle.images && cattle.images.length > 0 ? (
                  <img
                    src={cattle.images[0].url}
                    alt={cattle.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center hidden">
                  <div className="text-6xl">🐄</div>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{cattle.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{cattle.breed}</Badge>
                    {canDeleteCattle(cattle) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCattle(cattle._id)}
                        disabled={deleteLoading[cattle._id]}
                      >
                        {deleteLoading[cattle._id] ? (
                          'Deleting...'
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
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
                      <span className="font-medium">{cattle.seller?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{cattle.location}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
                      💡 Contact admin to connect with seller
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3">{cattle.description}</p>

                {/* Option 1: Current implementation with custom functions */}
                <div className="space-y-2 mt-4">
                  {/* Primary WhatsApp button */}
                  <Button 
                    onClick={() => handleContactAdmin(cattle)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Admin
                  </Button>
                  
                  {/* Other contact options dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <MoreHorizontal className="mr-2 h-4 w-4" />
                        More Options
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={() => handleCallAdmin()}
                        className="cursor-pointer"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleSMSAdmin(cattle)}
                        className="cursor-pointer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        SMS Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Option 2: Using the reusable AdminContactButtons component */}
                {/* 
                <AdminContactButtons 
                  itemName={cattle.name}
                  itemType={cattle.breed}
                  sellerName={cattle.seller?.name || 'Unknown'}
                  price={cattle.price}
                  variant="both"
                />
                */}
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
