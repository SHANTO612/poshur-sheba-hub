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

interface VetContactButtonsProps {
  phoneNumber: string;
  name: string;
  variant?: 'simple' | 'dropdown' | 'both';
  className?: string;
}

const VetContactButtons: React.FC<VetContactButtonsProps> = ({ 
  phoneNumber, 
  name,
  variant = 'both',
  className = ''
}) => {
  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as +880 1XXX XXX XXX
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+880 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    
    return phone;
  };

  const formattedPhone = formatPhoneNumber(phoneNumber);

  const handleWhatsApp = () => {
    const message = `Hello Dr. ${name}! I need veterinary consultation for my livestock. Could you please help me?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[\s\-\(\)]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp to contact veterinarian');
  };

  const handleCall = () => {
    window.open(`tel:${formattedPhone}`, '_blank');
    toast.success('Initiating call to veterinarian');
  };

  const handleSMS = () => {
    const message = `Hello Dr. ${name}! I need veterinary consultation for my livestock. Could you please help me?`;
    const smsUrl = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
    toast.success('Opening SMS to contact veterinarian');
  };

  if (variant === 'simple') {
    return (
      <Button 
        onClick={handleWhatsApp}
        className={`w-full bg-blue-600 hover:bg-blue-700 ${className}`}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Contact Dr. {name}
      </Button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={`w-full bg-blue-600 hover:bg-blue-700 ${className}`}>
            Contact Dr. {name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleWhatsApp} className="cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCall} className="cursor-pointer">
            <Phone className="mr-2 h-4 w-4" />
            Call
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSMS} className="cursor-pointer">
            <MessageCircle className="mr-2 h-4 w-4" />
            SMS
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
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Contact Dr. {name}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <MoreHorizontal className="mr-2 h-4 w-4" />
            More Options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCall} className="cursor-pointer">
            <Phone className="mr-2 h-4 w-4" />
            Call
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSMS} className="cursor-pointer">
            <MessageCircle className="mr-2 h-4 w-4" />
            SMS
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default VetContactButtons; 