import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collections/CollectionView";
import { collectionIndex, getCategory } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return collectionIndex().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const category = getCategory((await params).category);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  return <CollectionView category={category} />;
}
