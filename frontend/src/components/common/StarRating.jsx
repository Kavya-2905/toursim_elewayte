import { FiStar } from 'react-icons/fi';

export default function StarRating({ rating, size = 16, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'} transition-transform`}
        >
          <FiStar
            size={size}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
          />
        </button>
      ))}
    </div>
  );
}
