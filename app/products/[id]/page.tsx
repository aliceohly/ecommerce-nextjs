import PriceTag from "@/app/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import AddtoCartButton from "./AddToCartButton";

interface ProductPageProps {
  params: { id: string };
}

// fetch data for metadata and the product page
const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  // not-found.tsx is created in the app directory
  if (!product) notFound();
  return product;
});

// set metadata, it has to be named as generateMetadata
export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);

  return {
    title: product.name + "- Waw Corp",
    description: product.description,
    openGraph: { images: [{ url: product.imageUrl }] },
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await getProduct(id); // remember to use await

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Image
        src={product.imageUrl}
        alt={product.name}
        height={500}
        width={500}
        className="h-48 object-cover"
        priority
      />
      <div>
        <h2 className="text-2xl font-bold">{product.name} </h2>
        <p className="h-48 overflow-auto">{product.description}</p>
        <div className="flex">
          <PriceTag className="mt-2" productPrice={product.price} />
          <AddtoCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
