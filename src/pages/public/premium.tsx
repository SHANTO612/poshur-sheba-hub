import { Star, Video, Shield, Brain, Smartphone, CreditCard, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const premiumFeatures = [
  {
    icon: <Video className="h-5 w-5" />,
    title: 'Live Video Auction System',
    titleBn: 'লাইভ ভিডিও নিলাম সিস্টেম',
    description: 'Real-time bidding with HD video streaming'
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Verified Farm Badges',
    titleBn: 'যাচাইকৃত খামার ব্যাজ',
    description: 'Trust certification for quality assurance'
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: 'AI-based Cattle Price Estimation',
    titleBn: 'এআই-ভিত্তিক গবাদি পশুর মূল্য নির্ধারণ',
    description: 'Smart pricing using machine learning'
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: 'Mobile App Integration',
    titleBn: 'মোবাইল অ্যাপ ইন্টিগ্রেশন',
    description: 'iOS & Android app connectivity'
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: 'Payment Gateway (SSLCommerz)',
    titleBn: 'পেমেন্ট গেটওয়ে (এসএসএলকমার্জ)',
    description: 'Secure online payment processing'
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: 'GPS Farm Locator',
    titleBn: 'জিপিএস খামার লোকেটর',
    description: 'Real-time farm location tracking'
  }
];

const Premium = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full mb-4">
            <Star className="h-5 w-5" />
            <span className="font-semibold">Premium</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            CattleBase Premium Management
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
            ক্যাটেল বেস প্রিমিয়াম ব্যবস্থাপনা
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced features for modern livestock management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg text-green-600">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h4>
                    <h5 className="font-medium text-green-700 mb-2 text-sm">
                      {feature.titleBn}
                    </h5>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Coming Soon - আসছে শীঘ্রই
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
