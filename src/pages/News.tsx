
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar } from 'lucide-react';
import newsData from '../data/news.json';

const News = () => {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Health': 'bg-red-100 text-red-800',
      'Production': 'bg-green-100 text-green-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Sustainability': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('news.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Stay updated with the latest livestock industry news and insights
          </p>
        </div>

        {/* News Articles */}
        <div className="space-y-6">
          {newsData.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl leading-tight">
                    {article.title}
                  </CardTitle>
                  <Badge className={getCategoryColor(article.category)}>
                    {article.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.date)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {article.summary}
                </p>
                <div className="mt-4">
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                    Read more →
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-green-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-green-800 mb-2">Stay Informed</h3>
          <p className="text-gray-600 mb-4">
            Subscribe to our newsletter for the latest livestock industry updates
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
