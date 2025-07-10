
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Phone, Clock, User } from 'lucide-react';
import StarRating from '../components/StarRating';
import RatingDialog from '../components/RatingDialog';

const Vet = () => {
  const { t } = useLanguage();
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/veterinarians`);
        const result = await response.json();
        if (result.success) {
          setVeterinarians(result.data);
        } else {
          setError(result.message || 'Failed to fetch veterinarians');
        }
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
        setError('Could not connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarians();
  }, []);

  const handleRatingSubmitted = () => {
    // Refresh veterinarians to get updated ratings
    fetch(`${API_BASE_URL}/veterinarians`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setVeterinarians(result.data);
        }
      })
      .catch(error => {
        console.error("Error refreshing veterinarians:", error);
      });
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
            <p className="text-red-600">{error}</p>
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
                <div className="flex items-center gap-2">
                  <StarRating rating={vet.rating || 0} size="sm" showText={true} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{vet.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{vet.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{vet.availability}</span>
                  </div>
                  
                  <div className="pt-2">
                    <Badge variant="outline" className="mb-2">
                      {vet.specialization}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      <p><strong>Experience:</strong> {vet.experience}</p>
                      <p><strong>License:</strong> {vet.licenseNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Contact Veterinarian
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
