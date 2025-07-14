import React from 'react';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MessageSquare, Phone, MessageCircle, MoreHorizontal } from 'lucide-react';
import { toast } from '../ui/sonner';

interface AdminContactButtonsProps {
  itemName: string;
  itemType: string;
  sellerName: string;
  price: string;
  variant?: 'simple' | 'dropdown' | 'both';
  className?: string;
}

const AdminContactButtons: React.FC<AdminContactButtonsProps> = ({ 
  itemName, 
  itemType, 
  sellerName, 
  price,
  variant = 'both',
  className = ''
}) => {
  // Admin contact information
  const ADMIN_PHONE = "+8801787935543";
  const ADMIN_NAME = "CattleBes Admin";

  const handleWhatsApp = () => {
    const message = `Hello! I'm interested in the ${itemName} (${itemType}) listed for ${price} by ${sellerName}. Please help me connect with the seller.`;
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE.replace(/[\s\-\(\)]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp to contact admin');
  };

  const handleCallAdmin = () => {
    window.open(`tel:${ADMIN_PHONE}`, '_blank');
    toast.success('Initiating call to admin');
  };

  const handleSMSAdmin = () => {
    const message = `Hello! I'm interested in the ${itemName} (${itemType}) listed for ${price} by ${sellerName}. Please help me connect with the seller.`;
    const smsUrl = `sms:${ADMIN_PHONE}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
    toast.success('Opening SMS to contact admin');
  };

  if (variant === 'simple') {
    return (
      <Button 
        onClick={handleWhatsApp}
        className={`w-full bg-green-600 hover:bg-green-700 ${className}`}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Contact Admin
      </Button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={`w-full bg-green-600 hover:bg-green-700 ${className}`}>
            Contact Admin
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleWhatsApp} className="cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCallAdmin} className="cursor-pointer">
            <Phone className="mr-2 h-4 w-4" />
            Call Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSMSAdmin} className="cursor-pointer">
            <MessageCircle className="mr-2 h-4 w-4" />
            SMS Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default: both (WhatsApp button + dropdown for other options)
  return (
    <div className={`space-y-2 ${className}`}>
      <Button 
        onClick={handleWhatsApp}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Contact Admin
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <MoreHorizontal className="mr-2 h-4 w-4" />
            More Options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCallAdmin} className="cursor-pointer">
            <Phone className="mr-2 h-4 w-4" />
            Call Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSMSAdmin} className="cursor-pointer">
            <MessageCircle className="mr-2 h-4 w-4" />
            SMS Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminContactButtons; 