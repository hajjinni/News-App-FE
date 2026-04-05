import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiCheck, FiCheckCircle, FiTrash2, FiMail, FiBell, FiZap } from 'react-icons/fi';

const TYPE_ICONS = {
  email: <FiMail size={13} className="text-blue-500" />,
  push: <FiBell size={13} className="text-purple-500" />,
  realtime: <FiZap size={13} className="text-yellow-500" />,
};

const TYPE_LABELS = {
  email: 'Email',
  push: 'Push',
  realtime: 'Live',
};

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAlerts = useCallback(async () => {
    try {
      const { data } = await api.get('/alerts');
      setAlerts(data.alerts);
      setUnreadCount(data.unreadCount);
    } catch (err){
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const markRead = async (id) => {
    await api.patch(`/alerts/${id}/read`);
    setAlerts((prev) =>
      prev.map((a) => (a._id === id ? { ...a, read: true } : a))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await api.patch('/alerts/read-all');
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    setUnreadCount(0);
    toast.success('All marked as read');
  };

  const deleteAlert = async (id) => {
    await api.delete(`/alerts/${id}`);
    setAlerts((prev) => prev.filter((a) => a._id !== id));
    toast.success('Alert deleted');
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };
  console.log('All alerts:', alerts);
  const filtered = alerts.filter((a) => {
    if (filter === 'unread') return !a.read;
    if (filter === 'email') return a.type === 'email';
    if (filter === 'push') return a.type === 'push';
    if (filter === 'realtime') return a.type === 'realtime';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert History</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-indigo-600 mt-0.5 font-medium">
              {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <FiCheckCircle size={15} />
            Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', 'unread', 'realtime', 'email', 'push'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔔</div>
          <p className="text-gray-500">No alerts here yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Alerts will appear as news breaks.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((alert) => (
            <div
              key={alert._id}
              className={`bg-white border rounded-xl p-4 transition-all ${
                !alert.read
                  ? 'border-indigo-200 bg-indigo-50/30'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  alert.read ? 'bg-gray-300' : 'bg-indigo-500'
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {TYPE_ICONS[alert.type] || null}
                      {TYPE_LABELS[alert.type]}
                    </span>
                    {alert.article?.category && (
                      <span className="text-xs text-gray-400 capitalize">
                        {alert.article.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {timeAgo(alert.createdAt)}
                    </span>
                  </div>

                  {alert.article ? (
                     <a
                      href={alert.article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-gray-900 hover:text-indigo-600 line-clamp-2 transition-colors"
                      >
                    {alert.article.title}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Article unavailable</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!alert.read && (
                    <button
                      onClick={() => markRead(alert._id)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <FiCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}