// Contact utility functions for WhatsApp, phone calls, and SMS

export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters except +
  let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  
  // Handle different formats
  if (cleanPhone.startsWith('+880')) {
    return cleanPhone.slice(1); // Remove + for WhatsApp
  } else if (cleanPhone.startsWith('880')) {
    return cleanPhone;
  } else if (cleanPhone.startsWith('0')) {
    return `880${cleanPhone.slice(1)}`;
  } else if (cleanPhone.startsWith('+')) {
    return cleanPhone.slice(1); // Remove + for WhatsApp
  } else {
    // Assume it's a local number, add 880
    return `880${cleanPhone}`;
  }
};

export const openWhatsApp = (phoneNumber: string, name: string, customMessage?: string) => {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const defaultMessage = `Hello ${name}! I'm interested in connecting with you regarding your farming services. I found your profile on CattleBes.`;
  const message = customMessage || defaultMessage;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

export const openPhoneCall = (phoneNumber: string) => {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  window.open(`tel:+${formattedPhone}`, '_blank');
};

export const openSMS = (phoneNumber: string, name: string, customMessage?: string) => {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const defaultMessage = `Hello ${name}! I'm interested in connecting with you regarding your farming services. I found your profile on CattleBes.`;
  const message = customMessage || defaultMessage;
  const smsUrl = `sms:+${formattedPhone}?body=${encodeURIComponent(message)}`;
  window.open(smsUrl, '_blank');
};

// Alternative: Direct WhatsApp button with predefined message
export const createWhatsAppLink = (phoneNumber: string, name: string, customMessage?: string) => {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const defaultMessage = `Hello ${name}! I'm interested in connecting with you regarding your farming services. I found your profile on CattleBes.`;
  const message = customMessage || defaultMessage;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};

// Alternative: Get WhatsApp button props for use in components
export const getWhatsAppButtonProps = (phoneNumber: string, name: string, className = "") => {
  const handleClick = () => {
    openWhatsApp(phoneNumber, name);
  };

  return {
    onClick: handleClick,
    className: `bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center ${className}`,
  };
}; 