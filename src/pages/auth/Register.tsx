
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import authService, { RegisterData } from '../../services/auth';
import { toast } from '../../components/ui/sonner';

const Register = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    location: '',
    speciality: '',
    experience: '',
    description: '',
    specialization: '',
    clinicName: '',
    availability: '',
    licenseNumber: '',
    shopName: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Registration successful!');
        navigate('/');
      } else {
        toast.error(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Registration failed. Please try again.');
      } else {
        toast.error('Could not connect to the server. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderFarmerFields = () => (
    <>
      <div>
        <Label htmlFor="farmName">{t('auth.form.farmName')}</Label>
        <Input
          id="farmName"
          value={formData.farmName || ''}
          onChange={(e) => handleInputChange('farmName', e.target.value)}
          placeholder="Enter farm name"
        />
      </div>
      <div>
        <Label htmlFor="location">{t('auth.form.location')}</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Enter location"
        />
      </div>
      <div>
        <Label htmlFor="speciality">{t('auth.form.speciality')}</Label>
        <Input
          id="speciality"
          value={formData.speciality || ''}
          onChange={(e) => handleInputChange('speciality', e.target.value)}
          placeholder="Enter speciality"
        />
      </div>
      <div>
        <Label htmlFor="experience">{t('auth.form.experience')}</Label>
        <Input
          id="experience"
          value={formData.experience || ''}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          placeholder="Enter experience"
        />
      </div>
      <div>
        <Label htmlFor="description">{t('auth.form.description')}</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter description"
        />
      </div>
    </>
  );

  const renderVeterinarianFields = () => (
    <>
      <div>
        <Label htmlFor="clinicName">{t('auth.form.clinicName')}</Label>
        <Input
          id="clinicName"
          value={formData.clinicName || ''}
          onChange={(e) => handleInputChange('clinicName', e.target.value)}
          placeholder="Enter clinic name"
        />
      </div>
      <div>
        <Label htmlFor="location">{t('auth.form.location')}</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Enter location"
        />
      </div>
      <div>
        <Label htmlFor="specialization">{t('auth.form.specialization')}</Label>
        <Input
          id="specialization"
          value={formData.specialization || ''}
          onChange={(e) => handleInputChange('specialization', e.target.value)}
          placeholder="Enter specialization"
        />
      </div>
      <div>
        <Label htmlFor="licenseNumber">{t('auth.form.licenseNumber')}</Label>
        <Input
          id="licenseNumber"
          value={formData.licenseNumber || ''}
          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
          placeholder="Enter license number"
        />
      </div>
      <div>
        <Label htmlFor="availability">{t('auth.form.availability')}</Label>
        <Input
          id="availability"
          value={formData.availability || ''}
          onChange={(e) => handleInputChange('availability', e.target.value)}
          placeholder="Enter availability"
        />
      </div>
    </>
  );

  const renderSellerFields = () => (
    <>
      <div>
        <Label htmlFor="shopName">{t('auth.form.shopName')}</Label>
        <Input
          id="shopName"
          value={formData.shopName || ''}
          onChange={(e) => handleInputChange('shopName', e.target.value)}
          placeholder="Enter shop name"
          required
        />
      </div>
      <div>
        <Label htmlFor="location">{t('auth.form.location')}</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Enter location"
          required
        />
      </div>
    </>
  );

  const renderBuyerFields = () => (
    <div>
      <Label htmlFor="address">{t('auth.form.address')}</Label>
      <Textarea
        id="address"
        value={formData.address || ''}
        onChange={(e) => handleInputChange('address', e.target.value)}
        placeholder="Enter address"
      />
    </div>
  );

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-800">
              {t('auth.register.title')}
            </CardTitle>
            <p className="text-gray-600">{t('auth.register.subtitle')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('auth.form.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('auth.form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{t('auth.form.phone')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="userType">{t('auth.form.userType')}</Label>
                  <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                    <SelectTrigger disabled={loading}>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">{t('auth.userType.farmer')}</SelectItem>
                      <SelectItem value="buyer">{t('auth.userType.buyer')}</SelectItem>
                      <SelectItem value="veterinarian">{t('auth.userType.veterinarian')}</SelectItem>
                      <SelectItem value="seller">{t('auth.userType.seller')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dynamic fields based on user type */}
              {formData.userType === 'farmer' && renderFarmerFields()}
              {formData.userType === 'veterinarian' && renderVeterinarianFields()}
              {formData.userType === 'seller' && renderSellerFields()}
              {formData.userType === 'buyer' && renderBuyerFields()}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">{t('auth.form.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">{t('auth.form.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.register.button')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.have.account')}{' '}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                  {t('auth.login.link')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
