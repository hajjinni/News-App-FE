import { FiExternalLink, FiClock } from 'react-icons/fi';

const CATEGORY_COLORS = {
  technology: 'bg-blue-100 text-blue-700',
  sports: 'bg-green-100 text-green-700',
  business: 'bg-yellow-100 text-yellow-700',
  health: 'bg-pink-100 text-pink-700',
  science: 'bg-purple-100 text-purple-700',
  entertainment: 'bg-orange-100 text-orange-700',
  general: 'bg-gray-100 text-gray-700',
};

export default function NewsCard({ article, isNew = false }) {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className={`group block bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 ${
        isNew ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'
      }`}
    >
      {article.urlToImage && (
        <div className="w-full h-44 overflow-hidden bg-gray-100">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
            CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general
          }`}>
            {article.category}
          </span>
          {isNew && (
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {article.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium truncate max-w-[60%]">
            {article.source}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
            <FiClock size={11} />
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3 flex items-center gap-1 text-xs text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <FiExternalLink size={12} />
        <span>Read full article</span>
      </div>
    </a>
  );
}