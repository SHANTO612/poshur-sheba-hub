
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  MapPin, 
  User, 
  Phone, 
  MessageCircle, 
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { toast } from '../../components/ui/sonner';
import ContactButtons from '../../components/shared/ContactButtons';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const Farmers = () => {
  const { t } = useLanguage();
  const [farmersData, setFarmersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Utility function to format phone numbers
  const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters except +
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Handle different formats
    if (cleanPhone.startsWith('+880')) {
      return cleanPhone.slice(1); // Remove + for WhatsApp
    } else if (cleanPhone.startsWith('880')) {
      return cleanPhone;
    } else if (cleanPhone.startsWith('0')) {
      return `880${cleanPhone.slice(1)}`;
    } else if (cleanPhone.startsWith('+')) {
      return cleanPhone.slice(1); // Remove + for WhatsApp
    } else {
      // Assume it's a local number, add 880
      return `880${cleanPhone}`;
    }
  };

  // Contact functions
  const handleWhatsAppCall = (phoneNumber: string, farmerName: string) => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = `Hello ${farmerName}! I'm interested in connecting with you regarding your farming services. I found your profile on CattleBes.`;
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`Opening WhatsApp to contact ${farmerName}`);
  };

  const handlePhoneCall = (phoneNumber: string, farmerName: string) => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    window.open(`tel:+${formattedPhone}`, '_blank');
    toast.success(`Initiating call to ${farmerName}`);
  };

  const handleSMS = (phoneNumber: string, farmerName: string) => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = `Hello ${farmerName}! I'm interested in connecting with you regarding your farming services. I found your profile on CattleBes.`;
    const smsUrl = `sms:+${formattedPhone}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
    toast.success(`Opening SMS to contact ${farmerName}`);
  };

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

                  {farmer.description && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">About:</p>
                      <p className="text-gray-700 leading-relaxed">{farmer.description}</p>
                    </div>
                  )}

                  {/* Remove Cattle Listings and Total Sales section entirely */}

                  {/* Option 1: Current implementation with custom functions */}
                  {farmer.phone ? (
                    <div className="space-y-2">
                      {/* Primary WhatsApp button */}
                      <Button 
                        onClick={() => handleWhatsAppCall(farmer.phone, farmer.name)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        WhatsApp
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
                            onClick={() => handlePhoneCall(farmer.phone, farmer.name)}
                            className="cursor-pointer"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Phone Call
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleSMS(farmer.phone, farmer.name)}
                            className="cursor-pointer"
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            SMS
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
                      No Contact Info
                    </Button>
                  )}

                  {/* Option 2: Using the reusable ContactButtons component */}
                  {/* 
                  <ContactButtons 
                    phoneNumber={farmer.phone} 
                    name={farmer.name} 
                    variant="both"
                  />
                  */}
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
