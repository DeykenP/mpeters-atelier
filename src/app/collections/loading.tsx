export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Skeleton Hero */}
      <section className="w-full h-[40vh] min-h-[350px] bg-stone-200 animate-pulse flex items-center justify-center" />
      
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-8">
        {/* Skeleton Filters */}
        <div className="flex justify-center gap-8 mb-16 border-b border-stone-200 pb-4">
          <div className="w-24 h-5 bg-stone-100 animate-pulse rounded" />
          <div className="w-24 h-5 bg-stone-100 animate-pulse rounded" />
          <div className="w-24 h-5 bg-stone-100 animate-pulse rounded" />
        </div>
        
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[4/5] bg-stone-100 animate-pulse mb-6" />
              <div className="w-16 h-3 bg-stone-100 animate-pulse mx-auto mb-3" />
              <div className="w-3/4 h-6 bg-stone-100 animate-pulse mx-auto mb-3" />
              <div className="w-1/4 h-4 bg-stone-100 animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
