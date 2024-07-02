"use client";

import { useState, useTransition } from "react";
import { incrementProductQuantity } from "./actions";

interface AddtoCartButtonProps {
  productId: string;
}

export default async function AddToCartButton({
  productId,
}: AddtoCartButtonProps) {
  const [isPending, startTransition] = useTransition(); // need to use useTransition to use server component in client component
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        className="flex items-center gap-2 rounded bg-blue-400 px-4 py-2 text-white"
        onClick={() => {
          startTransition(async () => {
            setIsSuccess(false);
            await incrementProductQuantity(productId);
            setIsSuccess(true);
          });
        }}
      >
        Add to Cart
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </button>
      {/* why the loading spinner is at the top?? It seems that it is using the loading spinner from the loading page */}
      {isPending && <span className="loading loading-spinner loading-sm" />}
      {isSuccess && !isPending && (
        <span className="text-green-500">Added to cart</span>
      )}
    </div>
  );
}
