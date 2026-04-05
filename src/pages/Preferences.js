import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiCheck, FiSave } from 'react-icons/fi';
import {
  FiGlobe,
  FiBriefcase,
  FiCpu,
  FiActivity,
  FiHeart,
  FiAperture,
  FiFilm
} from 'react-icons/fi';

const CATEGORIES = ['general', 'business', 'technology', 'sports', 'health', 'science', 'entertainment'];

const CATEGORY_ICONS = {
  general: <FiGlobe className="text-gray-500" />,
  business: <FiBriefcase className="text-yellow-600" />,
  technology: <FiCpu className="text-blue-600" />,
  sports: <FiActivity className="text-green-600" />,
  health: <FiHeart className="text-red-500" />,
  science: <FiAperture className="text-purple-600" />,
  entertainment: <FiFilm className="text-pink-500" />,
};

export default function Preferences() {
  const [prefs, setPrefs] = useState({
    categories: ['general'],
    frequency: 'immediate',
    emailAlerts: true,
    pushAlerts: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/preferences')
      .then((res) => setPrefs(res.data))
      .catch(() => toast.error('Failed to load preferences'))
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (cat) => {
    setPrefs((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSave = async () => {
    if (prefs.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    setSaving(true);
    try {
      await api.put('/preferences', prefs);
      toast.success('Preferences saved!');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alert Preferences</h1>
        <p className="text-gray-500 text-sm mt-1">Customize what news you receive and how.</p>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">News Categories</h2>
          <p className="text-sm text-gray-500 mb-4">Select the topics you want to follow.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const active = prefs.categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    active
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-base flex items-center">{CATEGORY_ICONS[cat] || <FiGlobe />}</span>
                  <span className="capitalize">{cat}</span>
                  {active && <FiCheck size={14} className="ml-auto text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency */}
        <div className="bg-white border border-gray-500 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Alert Frequency</h2>
          <p className="text-sm text-gray-500 mb-4">How often do you want to be notified?</p>
          <div className="space-y-2">
            {[
              { value: 'immediate', label: 'Immediate', desc: 'Get notified the moment news breaks' },
              { value: 'hourly', label: 'Hourly digest', desc: 'A summary of top news every hour' },
              { value: 'daily', label: 'Daily digest', desc: 'One email each morning at 8 AM' },
            ].map(({ value, label, desc }) => (
              <label
                key={value}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  prefs.frequency === value
                    ? 'bg-indigo-50 border-indigo-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={value}
                  checked={prefs.frequency === value}
                  onChange={() => setPrefs((p) => ({ ...p, frequency: value }))}
                  className="mt-0.5 accent-indigo-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notification channels */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Notification Channels</h2>
          <p className="text-sm text-gray-500 mb-4">Choose how you receive alerts.</p>
          <div className="space-y-3">
            {[
              { key: 'emailAlerts', label: 'Email alerts', desc: 'Sent to your registered email address' },
              { key: 'pushAlerts', label: 'Browser push notifications', desc: 'Instant alerts in your browser' },
            ].map(({ key, label, desc }) => (
              <label
                key={key}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <div
                  onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                    prefs[key] ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      prefs[key] ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          <FiSave size={16} />
          {saving ? 'Saving...' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
}