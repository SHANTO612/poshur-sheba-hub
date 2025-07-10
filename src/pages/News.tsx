
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar } from 'lucide-react';

const NEWS_API_KEY = 'ed036617249b452f895c50b6c251d60e'; // <-- Replace with your NewsAPI.org API key
const GNEWS_API_KEY = '55bfbc52eee312b589d57a7937c19cb6'; // <-- Replace with your GNews.io API key

const NEWS_QUERY = '"cattle farm" OR "dairy farm" OR "livestock equipment" OR "dairy farmer" OR "cattle feed" OR "dairy equipment" OR "farm equipment" OR "cattle disease" OR "milk production" OR "livestock market"';
const KEYWORDS = [
  'cattle', 'dairy', 'milk', 'farm', 'farmer', 'livestock', 'feed', 'equipment', 'disease', 'production', 'market'
];

function isRelevant(article) {
  const title = (article.title || '').toLowerCase();
  return KEYWORDS.some(keyword => title.includes(keyword));
}

function normalizeUrl(url: string) {
  if (!url) return '';
  // Remove protocol
  let norm = url.replace(/^https?:\/\//, '');
  // Remove trailing slash
  norm = norm.replace(/\/$/, '');
  // Remove common tracking params
  norm = norm.split('?')[0];
  return norm;
}

function normalizeTitle(title: string) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ') // remove punctuation, keep only alphanumerics and spaces
    .replace(/\s+/g, ' ')        // collapse whitespace
    .trim()
    .slice(0, 60);               // use first 60 chars
}

const News = () => {
  const { t } = useLanguage();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from NewsAPI
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(NEWS_QUERY)}&pageSize=10&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
        const newsApiPromise = fetch(newsApiUrl).then(res => res.json());

        // Fetch from GNews.io
        const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(NEWS_QUERY)}&lang=en&max=10&token=${GNEWS_API_KEY}`;
        const gnewsPromise = fetch(gnewsUrl).then(res => res.json());

        const [newsApiResult, gnewsResult] = await Promise.all([newsApiPromise, gnewsPromise]);

        let articles: any[] = [];
        if (newsApiResult.status === 'ok') {
          articles = articles.concat(newsApiResult.articles.map((a: any) => ({
            title: a.title,
            description: a.description || a.content || '',
            url: a.url,
            urlToImage: a.urlToImage,
            publishedAt: a.publishedAt,
            source: a.source?.name || 'NewsAPI',
          })));
        }
        if (gnewsResult.articles) {
          articles = articles.concat(gnewsResult.articles.map((a: any) => ({
            title: a.title,
            description: a.description || '',
            url: a.url,
            urlToImage: a.image,
            publishedAt: a.publishedAt,
            source: a.source?.name || 'GNews',
          })));
        }
        // Deduplicate by normalized title + published date (YYYY-MM-DD)
        const seen = new Set();
        const deduped = articles.filter(a => {
          const datePart = a.publishedAt ? a.publishedAt.slice(0, 10) : '';
          const titleKey = normalizeTitle(a.title) + '|' + datePart;
          console.log('Deduplication key:', titleKey); // Debug
          if (!titleKey || seen.has(titleKey)) return false;
          seen.add(titleKey);
          return true;
        });
        // Filter for relevance: keyword must be in the title
        const relevant = deduped.filter(isRelevant);
        setNewsData(relevant);
      } catch (error) {
        setError('Error fetching news data.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
            Stay updated with the latest cattle, dairy, farm, and equipment news from around the world
          </p>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* News Articles */}
        <div className="space-y-6">
          {newsData.map((article: any, idx) => (
            <Card key={article.url || idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl leading-tight">
                    {article.title}
                  </CardTitle>
                  {article.source && (
                    <Badge className="bg-green-100 text-green-800">
                      {article.source}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </CardHeader>
              <CardContent>
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <p className="text-gray-700 leading-relaxed mb-4">
                  {article.description || 'No summary available.'}
                </p>
                <div className="mt-4">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Read more →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
