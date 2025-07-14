
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MapPin, Clock, User, Phone, Users, Calendar } from 'lucide-react';
import RatingDialog from '../../components/business/users/RatingDialog';
import apiService from '../../services/api';
import { User as UserType } from '../../types/common';
import { toast } from '../../components/ui/sonner';

interface Veterinarian extends UserType {
  clinicName?: string;
  specialization?: string;
  licenseNumber?: string;
  availability?: string;
  rating?: number;
}

const Vet = () => {
  const { t } = useLanguage();
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const handleRatingSubmitted = async () => {
    // Refresh veterinarians to get updated ratings
    try {
      const response = await apiService.get<Veterinarian[]>('/veterinarians');
      if (response.success && response.data) {
        setVeterinarians(response.data);
      }
    } catch (error) {
      console.error("Error refreshing veterinarians:", error);
    }
  };

  const fetchVeterinarians = async (retryCount = 0) => {
    try {
      setLoading(true);
      console.log(`Fetching veterinarians from API... (attempt ${retryCount + 1})`);
      
      const response = await apiService.get<Veterinarian[]>('/veterinarians');
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        setVeterinarians(response.data);
        setError(null); // Clear any previous errors
      } else {
        setError(response.message || 'Failed to fetch veterinarians');
        toast.error(response.message || 'Failed to fetch veterinarians');
      }
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
      
      // Retry logic
      if (retryCount < 2) {
        console.log(`Retrying... (${retryCount + 1}/3)`);
        setTimeout(() => fetchVeterinarians(retryCount + 1), 2000);
        return;
      }
      
      // Provide more specific error messages
      if (error.name === 'AbortError') {
        setError('Request timeout - server may be down');
        toast.error('Request timeout - please check if server is running');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server - please ensure server is running on port 5000');
        toast.error('Cannot connect to server - please check server status');
      } else if (error.message.includes('Empty response')) {
        setError('Server returned empty response - please check server logs');
        toast.error('Server returned empty response');
      } else {
        setError('Could not connect to the server');
        toast.error('Could not connect to the server');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading veterinarians...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => {
                setError(null);
                fetchVeterinarians();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('vet.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Find experienced veterinarians for your livestock health needs
          </p>
        </div>

        {/* Veterinarians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {veterinarians.map((vet) => (
            <Card key={vet._id} className="hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{vet.name}</CardTitle>
                <p className="text-blue-600 font-medium">{vet.clinicName}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{vet.location}</span>
                  </div>
                  {vet.availability && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{vet.availability}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{vet.phone}</span>
                  </div>
                  
                  <div className="pt-2">
                    {vet.specialization && (
                      <Badge variant="outline" className="mb-2">
                        {vet.specialization}
                      </Badge>
                    )}
                    <div className="text-sm text-gray-600">
                      {vet.licenseNumber && (
                        <p><strong>License:</strong> {vet.licenseNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={() => window.location.href = '/vet-contact'}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Contact Dr
                  </Button>
                  <RatingDialog
                    veterinarianId={vet._id}
                    veterinarianName={vet.name}
                    onRatingSubmitted={handleRatingSubmitted}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {veterinarians.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No veterinarians found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vet;
