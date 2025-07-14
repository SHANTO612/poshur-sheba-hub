import { useState } from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { toast } from '../ui/sonner';

interface ContactButtonsProps {
  phoneNumber: string;
  name: string;
  className?: string;
}

const ContactButtons = ({ phoneNumber, name, className = "" }: ContactButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Format phone number for different uses
  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove any non-digit characters and ensure it starts with country code
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('880')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '880' + cleaned.substring(1);
    } else if (cleaned.startsWith('1')) {
      return '880' + cleaned;
    }
    return '880' + cleaned;
  };

  const formatPhoneForCall = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('880')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+880' + cleaned.substring(1);
    } else if (cleaned.startsWith('1')) {
      return '+880' + cleaned;
    }
    return '+880' + cleaned;
  };

  const handleWhatsApp = () => {
    const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
    const message = `Hello ${name}, I would like to contact you regarding veterinary services.`;
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
    setIsOpen(false);
  };

  const handleCall = () => {
    const formattedPhone = formatPhoneForCall(phoneNumber);
    window.open(`tel:${formattedPhone}`, '_blank');
    toast.success('Opening phone dialer...');
    setIsOpen(false);
  };

  const handleSMS = () => {
    const formattedPhone = formatPhoneForCall(phoneNumber);
    const message = `Hello ${name}, I would like to contact you regarding veterinary services.`;
    const smsUrl = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`;
    
    window.open(smsUrl, '_blank');
    toast.success('Opening SMS...');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className={`bg-blue-600 hover:bg-blue-700 ${className}`}>
          <Phone className="h-4 w-4 mr-2" />
          Contact {name.split(' ')[0]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleWhatsApp}>
          <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
          WhatsApp
          <ExternalLink className="h-3 w-3 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCall}>
          <Phone className="h-4 w-4 mr-2 text-blue-600" />
          Phone Call
          <ExternalLink className="h-3 w-3 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSMS}>
          <MessageCircle className="h-4 w-4 mr-2 text-gray-600" />
          SMS
          <ExternalLink className="h-3 w-3 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContactButtons; 