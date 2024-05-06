// By default, page.tsx within the app directory is a server route.
// This means that the code within the file is executed on the server.
// This is useful for fetching data, interacting with databases, and other server-side operations.

import { prisma } from "@/lib/db/prisma";
import ProductCard from "./components/ProductCard";
import Image from "next/image";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="hero bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src={products[0].imageUrl}
            alt={products[0].name}
            className="w-full max-w-sm rounded-lg shadow-2xl"
            height={400}
            width={800}
          />
          <div>
            <h1 className="text-5xl font-bold">Adopt me please?</h1>
            <p className="py-6">
              Looking for your furry soulmate? Look no further! Our adoption
              center is filled with lovable pets just waiting to find their
              forever homes. From playful pups to cuddly kittens, and even
              adorable bunnies and guinea pigs, we have a companion for
              everyone. Come visit us today and let one of our sweet pets steal
              your heart! Adopt, don't shop, and make a lifelong friend.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
      <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </>
  );
}
