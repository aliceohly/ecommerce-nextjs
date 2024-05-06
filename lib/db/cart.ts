import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

// ??
export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  // Get local cart id from cookie, if exists, check in Prisma
  // If not, return null
  const localCardId = cookies().get("localCartId")?.value;
  const cart = localCardId
    ? await prisma.cart.findUnique({
        where: { id: localCardId },
        include: { items: { include: { product: true } } },
      })
    : null;

  console.log(`cart`, cart);

  if (!cart) return null;

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
  };
}

// Create empty cart
export async function createCart(): Promise<ShoppingCart> {
  const newCart = await prisma.cart.create({
    data: {},
  });

  cookies().set("localCartId", newCart.id);

  return { ...newCart, items: [], size: 0, subtotal: 0 };
}
