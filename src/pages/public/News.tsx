
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';

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
  if (!title) return '';
  return title.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

const News = () => {
  const { t } = useLanguage();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Fetch from NewsAPI - increased from 10 to 15
      const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(NEWS_QUERY)}&pageSize=15&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
      const newsApiPromise = fetch(newsApiUrl).then(res => res.json());

      // Fetch from GNews.io - increased from 10 to 15
      const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(NEWS_QUERY)}&lang=en&max=15&token=${GNEWS_API_KEY}`;
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
        if (!titleKey || seen.has(titleKey)) return false;
        seen.add(titleKey);
        return true;
      });
      
      // Filter for relevance: keyword must be in the title
      const relevant = deduped.filter(isRelevant);
      
      // Ensure at least 5 news are shown
      const finalNews = relevant.length >= 5 ? relevant : relevant.concat(deduped.slice(0, 5 - relevant.length));
      
      setNewsData(finalNews);
      setLastUpdated(new Date());
    } catch (error) {
      setError('Error fetching news data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNews();

    // Set up interval for real-time updates (every 5 minutes)
    const interval = setInterval(() => {
      fetchNews(true); // true indicates it's a refresh
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchNews(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
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
          <p className="text-lg text-gray-600 mb-4">
            Stay updated with the latest cattle, dairy, farm, and equipment news from around the world
          </p>
          
          {/* Refresh Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              onClick={handleManualRefresh} 
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh News'}
            </Button>
            
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Last updated: {formatLastUpdated(lastUpdated)}
              </div>
            )}
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        )}
        
        {refreshing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm">Refreshing news...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* News Articles */}
        {!loading && !error && (
          <div className="space-y-6">
            {newsData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No relevant news found. Try refreshing or check back later.</p>
              </div>
            ) : (
              newsData.map((article: any, idx) => (
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
