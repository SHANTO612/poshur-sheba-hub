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

interface AddProductDialogProps {
  onProductAdded?: () => void;
  product?: any; // Product to edit (optional)
  onProductUpdated?: () => void;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  type: string;
  unit: string;
  stock: number;
  halal: boolean;
  available: boolean;
  weight: string;
  origin: string;
}

const AddProductDialog = ({ onProductAdded, product, onProductUpdated }: AddProductDialogProps) => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  
  // Only sellers can access this component
  if (!user || user.userType !== 'seller') {
    return null;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add section state
  const [section, setSection] = useState<string>('');

  // Section options
  const sectionOptions = [
    { value: 'meat', label: 'Halal Meat Shop' },
    { value: 'dairy', label: 'Dairy Product' },
    { value: 'feed_equipment', label: 'Feed & Equipment' },
  ];

  // Category options by section
  const categoryOptions: Record<string, { value: string; label: string }[]> = {
    meat: [
      { value: 'beef', label: 'Beef' },
      { value: 'mutton', label: 'Mutton' },
      { value: 'chicken', label: 'Chicken' },
      { value: 'buffalo', label: 'Buffalo' },
      { value: 'organ', label: 'Organ' },
      { value: 'bone', label: 'Bone' },
    ],
    dairy: [
      { value: 'milk', label: 'Milk' },
      { value: 'yogurt', label: 'Yogurt' },
      { value: 'cheese', label: 'Cheese' },
      { value: 'butter', label: 'Butter' },
      { value: 'ghee', label: 'Ghee' },
      { value: 'cream', label: 'Cream' },
    ],
    feed_equipment: [
      { value: 'feed', label: 'Feed' },
      { value: 'supplement', label: 'Supplement' },
      { value: 'seed', label: 'Seed' },
      { value: 'equipment', label: 'Equipment' },
      { value: 'tool', label: 'Tool' },
      { value: 'machine', label: 'Machine' },
    ],
  };

  // Type options by section
  const typeOptions: Record<string, { value: string; label: string }[]> = {
    meat: [
      { value: 'meat', label: 'Meat' },
      { value: 'organ', label: 'Organ' },
      { value: 'bone', label: 'Bone' },
      { value: 'processed', label: 'Processed' },
    ],
    dairy: [
      { value: 'dairy', label: 'Dairy' },
    ],
    feed_equipment: [
      { value: 'feed', label: 'Feed' },
      { value: 'equipment', label: 'Equipment' },
    ],
  };

  // When section changes, reset category/type
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category: '',
      type: '',
    }));
  }, [section]);

  // Prefill form if editing
  const initialFormData: ProductFormData = product ? {
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    category: product.category || '',
    type: product.type || '',
    unit: product.unit || '',
    stock: product.stock || 0,
    halal: product.halal ?? true,
    available: product.available ?? true,
    weight: product.weight || '',
    origin: product.origin || '',
  } : {
    name: '',
    description: '',
    price: '',
    category: '',
    type: '',
    unit: '',
    stock: 0,
    halal: true,
    available: true,
    weight: '',
    origin: '',
  };

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  // Set section based on product category when editing
  useEffect(() => {
    if (product && product.category) {
      if (['beef', 'mutton', 'chicken', 'buffalo', 'organ', 'bone'].includes(product.category)) {
        setSection('meat');
      } else if (['milk', 'yogurt', 'cheese', 'butter', 'ghee', 'cream'].includes(product.category)) {
        setSection('dairy');
      } else if (['feed', 'supplement', 'seed', 'equipment', 'tool', 'machine'].includes(product.category)) {
        setSection('feed_equipment');
      }
    }
  }, [product]);

  // Prefill image URLs if editing
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setImageUrls(product.images.map((img: any) => img.url));
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Auto-set type based on category
      if (field === 'category') {
        if (['milk', 'yogurt', 'cheese', 'butter', 'ghee', 'cream'].includes(value as string)) {
          newData.type = 'dairy';
        } else if (['feed', 'supplement', 'seed'].includes(value as string)) {
          newData.type = 'feed';
        } else if (['equipment', 'tool', 'machine'].includes(value as string)) {
          newData.type = 'equipment';
        }
      }
      
      return newData;
    });
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
      toast.error('Please login to add products');
      return;
    }

    if (!product && images.length === 0) {
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

      let response, result;
      if (product) {
        // Edit mode (PUT)
        response = await fetch(`/api/products/${product._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
        result = await response.json();
        if (result.success) {
          toast.success('Product updated successfully!');
          setIsOpen(false);
          resetForm();
          onProductUpdated && onProductUpdated();
        } else {
          toast.error(result.message || 'Failed to update product');
        }
      } else {
        // Add mode (POST)
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
        result = await response.json();
        if (result.success) {
          toast.success('Product added successfully!');
          setIsOpen(false);
          resetForm();
          onProductAdded && onProductAdded();
        } else {
          toast.error(result.message || 'Failed to add product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      type: '',
      unit: '',
      stock: 0,
      halal: true,
      available: true,
      weight: '',
      origin: '',
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
        {product ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Selector */}
          <div>
            <Label htmlFor="section">Section *</Label>
            <Select value={section} onValueChange={setSection} required disabled={!!product}>
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sectionOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {product && (
              <p className="text-xs text-gray-600 mt-1">
                Section cannot be changed for existing products
              </p>
            )}
          </div>

          {/* Category Selector (filtered by section) */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={value => handleInputChange('category', value)}
              required
              disabled={!section}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(categoryOptions[section] || []).map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Selector (filtered by section) */}
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={value => handleInputChange('type', value)}
              required
              disabled={!section}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {(typeOptions[section] || []).map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Premium Beef"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="e.g., ৳650/kg"
                required
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="cup">Cup</SelectItem>
                  <SelectItem value="bottle">Bottle</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                  <SelectItem value="gram">Gram</SelectItem>
                  <SelectItem value="set">Set</SelectItem>
                  <SelectItem value="unit">Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                placeholder="e.g., 100"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (Optional)</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="e.g., 500g per piece"
              />
            </div>

            <div>
              <Label htmlFor="origin">Origin (Optional)</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder="e.g., Local Farm"
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
              placeholder="Describe the product, its quality, and any special features..."
              rows={4}
              required
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            {/* Only show halal checkbox for meat and dairy sections */}
            {(section === 'meat' || section === 'dairy') && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="halal"
                  checked={formData.halal}
                  onChange={(e) => handleInputChange('halal', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="halal">Halal Certified</Label>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => handleInputChange('available', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="available">Available for Sale</Label>
            </div>
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
            <Button type="submit" className={product ? 'w-full bg-blue-600 hover:bg-blue-700' : 'w-full bg-red-600 hover:bg-red-700'} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog; 