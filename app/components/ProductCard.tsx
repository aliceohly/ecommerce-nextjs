"use client";

import { Product } from "@prisma/client";
import Image from "next/image";
import PriceTag from "./PriceTag";
import Link from "next/link";

interface ProductProps {
  product: Product;
}

// why needs to have {} around product?
export default function ProductCard({ product }: ProductProps) {
  return (
    <Link
      className="card w-96 bg-base-100 shadow-xl"
      href={"/products/" + product.id}
    >
      <figure>
        <Image
          src={product.imageUrl}
          alt={product.name}
          height={400}
          width={800}
          className="h-48 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p className="h-48 overflow-auto">{product.description}</p>
        <PriceTag className="mt-2" productPrice={product.price} />
      </div>
    </Link>
  );
}
