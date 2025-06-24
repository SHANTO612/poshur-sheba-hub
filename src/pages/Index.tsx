
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Star, Video, Shield, Brain, Smartphone, CreditCard, MapPin } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t('market.title'),
      description: t('market.description'),
      link: '/market',
      icon: '🐄',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: t('meat.title'),
      description: t('meat.description'),
      link: '/meat-shop',
      icon: '🥩',
      color: 'bg-gradient-to-br from-red-500 to-red-600'
    },
    {
      title: t('farmers.title'),
      description: t('farmers.description'),
      link: '/farmers',
      icon: '👨‍🌾',
      color: 'bg-gradient-to-br from-amber-500 to-amber-600'
    },
    {
      title: t('dairy.title'),
      description: t('dairy.description'),
      link: '/dairy',
      icon: '🧀',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: t('vet.title'),
      description: t('vet.description'),
      link: '/vet',
      icon: '🩺',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      title: t('feed.title'),
      description: t('feed.description'),
      link: '/feed',
      icon: '🛒',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      title: t('premium.title'),
      description: t('premium.description'),
      link: '/premium',
      icon: '💼',
      color: 'bg-gradient-to-br from-green-700 to-yellow-500'
    }, {
      title: t('news.title'),
      description: t('news.description'),
      link: '/news',
      icon: '📰',
      color: 'bg-gradient-to-br from-gray-500 to-gray-600'
    },
    {
      title: t('contact.title'),
      description: t('contact.description'),
      link: '/contact',
      icon: '📞',
      color: 'bg-gradient-to-br from-teal-500 to-teal-600'
    }

  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-800 text-white py-20">
        <div 
          className="absolute inset-0 bg-black opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-4">
            {t('home.subtitle')}
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            {t('home.description')}
          </p>
          <Link to="/market">
            <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100 font-semibold px-8 py-3">
              Explore Services
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive livestock services to support farmers and communities across Bangladesh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={service.link} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 border-0 overflow-hidden">
                  <div className={`${service.color} text-white p-6 text-center`}>
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <CardTitle className="text-lg font-bold mb-2">
                      {service.title}
                    </CardTitle>
                  </div>
                  <CardContent className="p-6">
                    <CardDescription className="text-gray-600 text-center">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
     
      
      {/* CTA Section */}
      <section className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of farmers and livestock professionals across Bangladesh
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                {t('nav.register')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t('nav.contact')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
