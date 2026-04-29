export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl overflow-hidden border border-brand-border">
      <div className="h-52 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}
