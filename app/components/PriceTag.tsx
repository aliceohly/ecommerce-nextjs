"use client";

import { formatPrice } from "@/lib/formatPrice";

interface PriceTagProps {
  productPrice: number;
  className?: string;
}

export default function ProductCard({
  productPrice,
  className,
}: PriceTagProps) {
  return (
    <span className={`badge badge-ghost ${className}`}>
      {formatPrice(productPrice)}
    </span>
  );
}
