export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
  );
}
