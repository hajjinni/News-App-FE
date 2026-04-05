import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';
import NewsCard from '../components/NewsCard';
import CategoryFilter from '../components/CategoryFilter';
import { FiRefreshCw } from 'react-icons/fi';

const CATEGORIES = ['all', 'general', 'business', 'technology', 'sports', 'health', 'science', 'entertainment'];

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newArticleIds, setNewArticleIds] = useState(new Set());
  const [loadingMore, setLoadingMore] = useState(false);
  const topRef = useRef(null);

  const fetchNews = useCallback(async (cat, pg, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const params = { page: pg, limit: 18 };
      if (cat !== 'all') params.category = cat;

      const { data } = await api.get('/news', { params });
      const incoming = data.articles || [];

      if (append) {
        setArticles((prev) => [...prev, ...incoming]);
      } else {
        setArticles(incoming);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
      setTotalPages(data.pagination?.pages || 1);
    } catch {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchNews(category, 1, false);
  }, [category, fetchNews]);

  const onNewsAlert = useCallback((data) => {
    const { article } = data;
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-lg rounded-xl border border-indigo-200 p-4 flex gap-3`}
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-indigo-600 text-xs font-bold">!</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-indigo-600 uppercase mb-0.5">
              Breaking — {article.category}
            </p>
            <p className="text-sm text-gray-800 line-clamp-2">{article.title}</p>
          </div>
        </div>
      ),
      { duration: 6000 }
    );

    if (category === 'all' || category === data.category) {
      setArticles((prev) => [article, ...prev]);
      setNewArticleIds((prev) => new Set([...prev, article._id]));
      setTimeout(() => {
        setNewArticleIds((prev) => {
          const next = new Set(prev);
          next.delete(article._id);
          return next;
        });
      }, 10000);
    }
  }, [category]);

  useSocket(onNewsAlert);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchNews(category, next, true);
  };

  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-44 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div ref={topRef} className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Latest News</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {articles.length} article{articles.length !== 1 ? 's' : ''} loaded
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
          <button
            onClick={() => fetchNews(category, 1, false)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <FiRefreshCw size={16} />
          </button>
        </div>
      </div>

      <CategoryFilter categories={CATEGORIES} active={category} onChange={setCategory} />

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-gray-500">No articles found for this category yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back in a few minutes.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <NewsCard
                  key={article._id}
                  article={article}
                  isNew={newArticleIds.has(article._id)}
                />
              ))}
            </div>

            {page < totalPages && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}