
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

const Register = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: '',
    // Farmer specific fields
    farmName: '',
    location: '',
    speciality: '',
    experience: '',
    description: '',
    // Veterinarian specific fields
    specialization: '',
    clinicName: '',
    availability: '',
    licenseNumber: '',
    // Seller specific fields
    shopName: '',
    businessType: '',
    // Common fields
    address: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Prepare data based on user type
    const submitData: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      userType: formData.userType,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    // Add role-specific fields based on user type
    if (formData.userType === 'farmer') {
      if (formData.farmName) submitData.farmName = formData.farmName;
      if (formData.location) submitData.location = formData.location;
      if (formData.speciality) submitData.speciality = formData.speciality;
      if (formData.experience) submitData.experience = formData.experience;
      if (formData.description) submitData.description = formData.description;
    } else if (formData.userType === 'veterinarian') {
      if (formData.clinicName) submitData.clinicName = formData.clinicName;
      if (formData.location) submitData.location = formData.location;
      if (formData.specialization) submitData.specialization = formData.specialization;
      if (formData.licenseNumber) submitData.licenseNumber = formData.licenseNumber;
      if (formData.availability) submitData.availability = formData.availability;
    } else if (formData.userType === 'seller') {
      if (formData.shopName) submitData.shopName = formData.shopName;
      if (formData.location) submitData.location = formData.location;
      if (formData.businessType) submitData.businessType = formData.businessType;
    } else if (formData.userType === 'buyer') {
      if (formData.address) submitData.address = formData.address;
    }

    try {
      console.log('Sending registration data:', submitData);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      const data = await response.json();
      console.log('Registration response:', data);
      if (data.success) {
        login(data.data.user, data.data.token);
        navigate('/');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderFarmerFields = () => (
    <>
      <div>
        <Label htmlFor="farmName">Farm Name</Label>
        <Input
          id="farmName"
          type="text"
          value={formData.farmName}
          onChange={(e) => handleInputChange('farmName', e.target.value)}
          placeholder="Enter your farm name"
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="e.g., Savar, Dhaka"
          required
        />
      </div>
      <div>
        <Label htmlFor="speciality">Speciality</Label>
        <Select value={formData.speciality} onValueChange={(value) => handleInputChange('speciality', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your speciality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dairy Farming">Dairy Farming</SelectItem>
            <SelectItem value="Cattle Breeding">Cattle Breeding</SelectItem>
            <SelectItem value="Mixed Farming">Mixed Farming</SelectItem>
            <SelectItem value="Organic Farming">Organic Farming</SelectItem>
            <SelectItem value="Buffalo Farming">Buffalo Farming</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="experience">Experience</Label>
        <Input
          id="experience"
          type="text"
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          placeholder="e.g., 10 years"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Tell us about your farming experience and practices..."
          rows={3}
        />
      </div>
    </>
  );

  const renderVeterinarianFields = () => (
    <>
      <div>
        <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
        <Input
          id="clinicName"
          type="text"
          value={formData.clinicName}
          onChange={(e) => handleInputChange('clinicName', e.target.value)}
          placeholder="Enter your clinic name"
          required
        />
      </div>
      <div>
        <Label htmlFor="specialization">Specialization</Label>
        <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General Veterinary">General Veterinary</SelectItem>
            <SelectItem value="Animal Surgery">Animal Surgery</SelectItem>
            <SelectItem value="Dairy Health">Dairy Health</SelectItem>
            <SelectItem value="Poultry Health">Poultry Health</SelectItem>
            <SelectItem value="Emergency Care">Emergency Care</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input
          id="licenseNumber"
          type="text"
          value={formData.licenseNumber}
          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
          placeholder="Enter your veterinary license number"
          required
        />
      </div>
      <div>
        <Label htmlFor="availability">Availability</Label>
        <Input
          id="availability"
          type="text"
          value={formData.availability}
          onChange={(e) => handleInputChange('availability', e.target.value)}
          placeholder="e.g., Mon-Sat, 9AM-6PM"
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="e.g., Dhaka, Chittagong"
          required
        />
      </div>
    </>
  );

  const renderSellerFields = () => (
    <>
      <div>
        <Label htmlFor="shopName">Shop/Business Name</Label>
        <Input
          id="shopName"
          type="text"
          value={formData.shopName}
          onChange={(e) => handleInputChange('shopName', e.target.value)}
          placeholder="Enter your shop name"
          required
        />
      </div>
      <div>
        <Label htmlFor="businessType">Business Type</Label>
        <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Meat Shop">Meat Shop</SelectItem>
            <SelectItem value="Dairy Products">Dairy Products</SelectItem>
            <SelectItem value="Feed Store">Feed Store</SelectItem>
            <SelectItem value="Equipment Store">Equipment Store</SelectItem>
            <SelectItem value="Mixed Business">Mixed Business</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="e.g., Dhaka, Chittagong"
          required
        />
      </div>
    </>
  );

  const renderBuyerFields = () => (
    <div>
      <Label htmlFor="address">Address</Label>
      <Textarea
        id="address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        placeholder="Enter your address"
        rows={2}
      />
    </div>
  );

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-800">
              {t('nav.register')}
            </CardTitle>
            <p className="text-gray-600">Join the Poshur Sheba community</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+880 1711-123456"
                  required
                />
              </div>

              <div>
                <Label htmlFor="userType">User Type</Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="veterinarian">Veterinarian</SelectItem>
                    <SelectItem value="seller">Meat Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic fields based on user type */}
              {formData.userType === 'farmer' && renderFarmerFields()}
              {formData.userType === 'veterinarian' && renderVeterinarianFields()}
              {formData.userType === 'seller' && renderSellerFields()}
              {formData.userType === 'buyer' && renderBuyerFields()}
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Registering...' : t('nav.register')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                  {t('nav.login')}
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
