export default function Loading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Skeleton Hero */}
      <section className="w-full h-[45vh] min-h-[360px] bg-stone-900 animate-pulse" />

      <section className="py-20 md:py-28 container mx-auto px-6 md:px-12">
        {/* Skeleton Filters */}
        <div className="flex justify-center gap-10 mb-20 border-b border-stone-200 pb-5">
          <div className="w-24 h-4 bg-stone-200 animate-pulse" />
          <div className="w-24 h-4 bg-stone-200 animate-pulse" />
          <div className="w-24 h-4 bg-stone-200 animate-pulse" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="aspect-[4/5] w-full bg-stone-200 animate-pulse mb-6" />
              <div className="w-3/4 h-5 bg-stone-200 animate-pulse mb-3" />
              <div className="w-1/4 h-3 bg-stone-200 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
