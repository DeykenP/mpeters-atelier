import type { Metadata } from "next";
import { CollectionView } from "@/components/collections/CollectionView";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Necklaces, bracelets, rings, earrings, pendants and anklets in moissanite, sterling silver and gold finishes — made to order.",
};

export default function CollectionsPage() {
  return <CollectionView />;
}
