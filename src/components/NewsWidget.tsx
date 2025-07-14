import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, RefreshCw, ExternalLink } from 'lucide-react';

interface NewsWidgetProps {
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  showRefreshButton?: boolean;
  className?: string;
}

interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  image?: {
    url: string;
  };
  views: number;
  readTime: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const NewsWidget = ({ 
  limit = 5, 
  autoRefresh = true, 
  refreshInterval = 5 * 60 * 1000, // 5 minutes default
  showRefreshButton = true,
  className = ""
}: NewsWidgetProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const fetchNews = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/news/latest?limit=${limit}`);
      const result = await response.json();

      if (result.success) {
        setNews(result.data);
        setLastUpdated(new Date());
      } else {
        setError(result.message || 'Failed to fetch news');
      }
    } catch (error) {
      setError('Error fetching news data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNews();

    // Set up interval for real-time updates if autoRefresh is enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchNews(true);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [limit, autoRefresh, refreshInterval]);

  const handleManualRefresh = () => {
    fetchNews(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
          <Button 
            onClick={handleManualRefresh} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Latest News</h3>
        
        <div className="flex items-center gap-2">
          {showRefreshButton && (
            <Button 
              onClick={handleManualRefresh} 
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          )}
          
          {lastUpdated && (
            <div className="text-xs text-gray-500">
              Updated: {formatLastUpdated(lastUpdated)}
            </div>
          )}
        </div>
      </div>

      {/* News List */}
      <div className="space-y-3">
        {news.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No news available</p>
          </div>
        ) : (
          news.map((item) => (
            <Card key={item._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm leading-tight line-clamp-2">
                    {item.title}
                  </CardTitle>
                  {item.featured && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.createdAt)}</span>
                  <span>•</span>
                  <span>{item.readTime}</span>
                  <span>•</span>
                  <span>{item.views} views</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-600 hover:text-green-700 p-0 h-auto"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Read
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View All Link */}
      {news.length > 0 && (
        <div className="mt-4 text-center">
          <Button variant="link" className="text-green-600 hover:text-green-700">
            View All News →
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsWidget; 