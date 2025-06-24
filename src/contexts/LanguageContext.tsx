
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.market': 'Livestock Market',
    'nav.meat': 'Halal Meat Shop',
    'nav.farmers': 'Farmers',
    'nav.dairy': 'Dairy Products',
    'nav.vet': 'Veterinary',
    'nav.feed': 'Feed & Equipment',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'home.title': 'CattleBes',
    'home.subtitle': 'Your Complete Livestock Service Platform',
    'home.description': 'Connecting farmers, buyers, and livestock professionals across Bangladesh',
    'services.title': 'Our Services',
    'market.title': 'Livestock Market',
    'market.description': 'Buy and sell quality livestock',
    'meat.title': 'Halal Meat Shop',
    'meat.description': 'Fresh halal meat products',
    'farmers.title': 'Farmers & Farms',
    'farmers.description': 'Connect with local farmers',
    'dairy.title': 'Dairy Products',
    'dairy.description': 'Fresh milk and dairy items',
    'vet.title': 'Veterinary Services',
    'vet.description': 'Professional animal healthcare',
    'feed.title': 'Feed & Equipment',
    'feed.description': 'Quality feed and farming tools',
    'news.title': 'Articles & News',
    'news.description': 'Latest livestock industry updates',
    'contact.title': 'Contact Us',
    'contact.description': 'Get in touch with us',
    'premium.title': 'CattleBase Premium Management',
    'premium.description': 'Advanced features for modern livestock management',
  },
  bn: {
    'nav.home': 'হোম',
    'nav.market': 'পশুর বাজার',
    'nav.meat': 'হালাল মাংসের দোকান',
    'nav.farmers': 'কৃষকগণ',
    'nav.dairy': 'দুগ্ধজাত পণ্য',
    'nav.vet': 'পশু চিকিৎসা',
    'nav.feed': 'খাদ্য ও সরঞ্জাম',
    'nav.news': 'সংবাদ',
    'nav.contact': 'যোগাযোগ',
    'nav.login': 'লগইন',
    'nav.register': 'নিবন্ধন',
    'home.title': ' ক্যাটেলবেস',
    'home.subtitle': 'আপনার সম্পূর্ণ পশুসেবা প্ল্যাটফর্ম',
    'home.description': 'পশুপালনকারীদের সঙ্গে কৃষক ও ক্রেতাদের সংযুক্ত করার স্মার্ট সমাধান',
    'services.title': 'আমাদের সেবাসমূহ',
    'market.title': 'পশুর বাজার',
    'market.description': 'মানসম্পন্ন পশু কিনুন ও বিক্রি করুন',
    'meat.title': 'হালাল মাংসের দোকান',
    'meat.description': 'তাজা হালাল মাংসের পণ্য',
    'farmers.title': 'কৃষক ও খামার',
    'farmers.description': 'স্থানীয় কৃষকদের সাথে যোগাযোগ',
    'dairy.title': 'দুগ্ধজাত পণ্য',
    'dairy.description': 'তাজা দুধ ও দুগ্ধজাত পণ্য',
    'vet.title': 'পশু চিকিৎসা সেবা',
    'vet.description': 'পেশাদার পশু স্বাস্থ্যসেবা',
    'feed.title': 'খাদ্য ও সরঞ্জাম',
    'feed.description': 'মানসম্পন্ন খাদ্য ও কৃষি সরঞ্জাম',
    'news.title': 'নিবন্ধ ও সংবাদ',
    'news.description': 'পশুপালন শিল্পের সর্বশেষ আপডেট',
    'contact.title': 'যোগাযোগ করুন',
    'contact.description': 'আমাদের সাথে যোগাযোগ করুন'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
