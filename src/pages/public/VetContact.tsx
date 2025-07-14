import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Activity,
  Star,
  User,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from '../../components/business/appointments/AppointmentForm';
import apiService from '../../services/api';
import { toast } from '../../components/ui/sonner';

interface Veterinarian {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  clinicName: string;
  specialization: string;
  licenseNumber: string;
  availability: string;
  experience: string;
  description: string;
  avatar?: string;
}

const VetContact = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/veterinarians');
      
      if (response.success) {
        setVeterinarians((response.data as Veterinarian[]) || []);
      }
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as +880 1XXX XXX XXX
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+880 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    
    return phone;
  };

  const handleAppointmentBooked = () => {
    toast.success('Appointment booked successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading veterinarians...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('vet.contact.title')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('vet.contact.description')}
          </p>
          
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Book Appointments</h3>
              </div>
              <p className="text-sm text-blue-700 mt-1">Schedule consultations with veterinarians</p>
            </div>
          </div>
        </div>

        {veterinarians.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('vet.contact.no.available')}</h3>
              <p className="text-gray-600">
                {t('vet.contact.check.later')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {veterinarians.map((vet) => (
              <Card key={vet._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={vet.avatar || ''} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {vet.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{vet.name}</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">
                        Veterinarian
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Professional Information */}
                  <div className="space-y-3">
                    {vet.clinicName && (
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{vet.clinicName}</span>
                      </div>
                    )}
                    
                    {vet.specialization && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-green-600" />
                        <span>{vet.specialization}</span>
                      </div>
                    )}
                    
                    {vet.experience && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>{vet.experience} experience</span>
                      </div>
                    )}
                    
                    {vet.licenseNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-orange-600" />
                        <span>License: {vet.licenseNumber}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{formatPhoneNumber(vet.phone)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{vet.email}</span>
                    </div>
                    
                    {vet.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{vet.location}</span>
                      </div>
                    )}
                  </div>

                  {vet.description && (
                    <>
                      <Separator />
                      <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-1">About:</p>
                        <p className="text-gray-600 leading-relaxed">{vet.description}</p>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4">
                    <AppointmentForm
                      veterinarian={{
                        _id: vet._id,
                        name: vet.name,
                        phone: vet.phone,
                        clinicName: vet.clinicName,
                        specialization: vet.specialization
                      }}
                      onAppointmentBooked={handleAppointmentBooked}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VetContact; 