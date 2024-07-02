// By default, page.tsx within the app directory is a server route.
// This means that the code within the file is executed on the server.
// This is useful for fetching data, interacting with databases, and other server-side operations.

import { prisma } from "@/lib/db/prisma";
import ProductCard from "./components/ProductCard";
import Image from "next/image";
import PaginationBar from "./components/PaginationBar";

interface HomeProps {
  searchParams: { page: string };
}

export default async function Home({
  searchParams: { page = "1" },
}: HomeProps) {
  const productsCount = await prisma.product.count();
  const productsPerPage = 6;
  const currentPage = parseInt(page);
  const totalPages = Math.ceil(productsCount / productsPerPage);

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * productsPerPage,
    take: productsPerPage,
  });

  return (
    <>
      {currentPage === 1 && (
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
              <h1 className="text-5xl font-bold">Asian Snack</h1>
              <p className="py-6">
                Welcome to [Your Store Name], your ultimate online destination
                for the most delightful and delicious Asian snacks! We're here
                to satisfy your cravings with a handpicked selection of treats
                from across the continent, bringing the vibrant flavors of Asia
                right to your doorstep.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
      <div className="mb-5 mt-10 flex justify-center">
        <PaginationBar currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
