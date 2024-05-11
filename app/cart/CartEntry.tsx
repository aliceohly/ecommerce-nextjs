"use client";

import { CartItem } from "@/lib/db/cart";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";
import { useState, useTransition } from "react";
import { amendProductQuantity, removeProduct } from "./actions";

interface CartEntryProps {
  item: CartItem;
}

export default function CartEntry({ item }: CartEntryProps) {
  const dropdownRange = [];
  for (let i = 0; i <= 15; i++) {
    dropdownRange.push(i);
  }

  const [isPending, startTransition] = useTransition(); // need to use useTransition to use server component in client component
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <>
      <div className="flex gap-4">
        <Link href={`/products/${item.productId}`}>
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            height={400}
            width={400}
            className="h-48 object-cover"
          />
        </Link>
        <div className="min-w-[200px]">
          <div className="font-bold">{item.product.name}</div>
          <div className="flex items-center gap-5">
            <div>
              <select
                className="select select-bordered w-[80px]"
                defaultValue={item.quantity}
                onChange={(e) => {
                  startTransition(async () => {
                    setIsSuccess(false);
                    await amendProductQuantity(
                      item.productId,
                      parseInt(e.target.value),
                    );
                    setIsSuccess(true);
                  });
                }}
              >
                {dropdownRange.map((i) => {
                  return (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>{formatPrice(item.product.price * item.quantity)}</div>
          </div>
          <button
            className="mt-3 text-xs underline"
            onClick={() => removeProduct(item.productId)}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
}
