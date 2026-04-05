import { FiBell } from 'react-icons/fi';

export default function AlertBell({ count }) {
  return (
    <div className="relative inline-flex">
      <FiBell size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
}