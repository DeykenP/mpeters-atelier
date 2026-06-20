import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  return (
    <div className="flex flex-col gap-6">
      {images.map((img, idx) => (
        <div key={idx} className="relative aspect-square md:aspect-[4/5] w-full bg-stone-50 overflow-hidden">
          <Image
            src={img}
            alt={`${name} - View ${idx + 1}`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={idx === 0}
          />
        </div>
      ))}
    </div>
  );
}
