import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Upload, X, Loader2 } from 'lucide-react';
import { toast } from './ui/sonner';

interface AddCattleDialogProps {
  onCattleAdded: () => void;
}

interface CattleFormData {
  name: string;
  breed: string;
  weight: string;
  age: string;
  price: string;
  type: string;
  description: string;
}

const AddCattleDialog = ({ onCattleAdded }: AddCattleDialogProps) => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CattleFormData>({
    name: '',
    breed: '',
    weight: '',
    age: '',
    price: '',
    type: '',
    description: '',
  });

  // Pre-fill description with template when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        description: user.speciality ? 
          `Healthy ${user.speciality.toLowerCase()} cattle. Well-maintained and properly cared for. Contact for more details.` : 
          'Healthy cattle available for sale. Well-maintained and properly cared for. Contact for more details.',
      }));
    }
  }, [isOpen, user]);

  const handleInputChange = (field: keyof CattleFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast.error('Only image files are allowed');
        return false;
      }
      
      if (!isValidSize) {
        toast.error('File size must be less than 5MB');
        return false;
      }
      
      return true;
    });

    if (images.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) {
      toast.error('Please login to add cattle');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Add images
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('/api/cattle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Cattle added successfully!');
        setIsOpen(false);
        resetForm();
        onCattleAdded();
      } else {
        toast.error(result.message || 'Failed to add cattle');
      }
    } catch (error) {
      console.error('Error adding cattle:', error);
      toast.error('Failed to add cattle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      breed: '',
      weight: '',
      age: '',
      price: '',
      type: '',
      description: '',
    });
    setImages([]);
    setImageUrls([]);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Cattle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Cattle Listing</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Location and contact information will be automatically added from your profile.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Cattle Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter cattle name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="breed">Breed *</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                placeholder="e.g., Holstein, Jersey"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cow">Cow</SelectItem>
                  <SelectItem value="Bull">Bull</SelectItem>
                  <SelectItem value="Calf">Calf</SelectItem>
                  <SelectItem value="Buffalo">Buffalo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight">Weight *</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="e.g., 380 kg"
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="e.g., 4 years"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="e.g., ৳65,000"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the cattle, its characteristics, and any special features..."
              rows={4}
              required
              className={user?.speciality ? "bg-gray-50" : ""}
            />
            {user?.speciality && (
              <p className="text-xs text-blue-600 mt-1">
                Template pre-filled based on your speciality
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label>Images * (Max 5 images, 5MB each)</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </div>

            {/* Image Previews */}
            {imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Cattle'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCattleDialog; 