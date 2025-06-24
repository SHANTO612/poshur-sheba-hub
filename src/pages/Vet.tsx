
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Phone, Clock } from 'lucide-react';

const Vet = () => {
  const { t } = useLanguage();

  const veterinarians = [
    {
      id: 1,
      name: 'Dr. Mohammad Hasan',
      specialization: 'Large Animal Medicine',
      experience: '15 years',
      location: 'Dhaka',
      contact: '+880 1111-111111',
      availability: 'Mon-Sat, 9AM-6PM',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Dr. Fatema Ahmed',
      specialization: 'Dairy Cattle Health',
      experience: '12 years',
      location: 'Chittagong',
      contact: '+880 1222-222222',
      availability: 'Mon-Fri, 8AM-5PM',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Dr. Abdul Rahman',
      specialization: 'Poultry & Small Animals',
      experience: '10 years',
      location: 'Sylhet',
      contact: '+880 1333-333333',
      availability: 'Daily, 24/7 Emergency',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Dr. Nasreen Sultana',
      specialization: 'Animal Surgery',
      experience: '18 years',
      location: 'Rajshahi',
      contact: '+880 1444-444444',
      availability: 'Mon-Sat, 10AM-7PM',
      rating: 4.9
    },
    {
      id: 5,
      name: 'Dr. Karim Uddin',
      specialization: 'Livestock Reproduction',
      experience: '14 years',
      location: 'Khulna',
      contact: '+880 1555-555555',
      availability: 'Mon-Fri, 9AM-6PM',
      rating: 4.6
    },
    {
      id: 6,
      name: 'Dr. Rashida Begum',
      specialization: 'Animal Nutrition',
      experience: '11 years',
      location: 'Barisal',
      contact: '+880 1666-666666',
      availability: 'Mon-Sat, 8AM-4PM',
      rating: 4.8
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('vet.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Professional veterinary care for your livestock
          </p>
        </div>

        {/* Veterinarians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {veterinarians.map((vet) => (
            <Card key={vet.id} className="hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                <div className="text-5xl">🩺</div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{vet.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {vet.specialization}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">Experience:</span>
                    <span className="font-medium">{vet.experience}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{vet.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{vet.contact}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{vet.availability}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium ml-1">{vet.rating}/5</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Section */}
        <div className="mt-12 bg-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-800 mb-6">Our Veterinary Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🏥</div>
              <h4 className="font-medium mb-1">Health Checkups</h4>
              <p className="text-sm text-gray-600">Regular health examinations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💉</div>
              <h4 className="font-medium mb-1">Vaccinations</h4>
              <p className="text-sm text-gray-600">Disease prevention programs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔬</div>
              <h4 className="font-medium mb-1">Diagnostics</h4>
              <p className="text-sm text-gray-600">Laboratory testing services</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚨</div>
              <h4 className="font-medium mb-1">Emergency Care</h4>
              <p className="text-sm text-gray-600">24/7 emergency services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vet;
