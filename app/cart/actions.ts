"use server"; // without this line the file will be treated as a client file ???

import { getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function amendProductQuantity(
  productId: string,
  newQuantity: number,
) {
  const cart = await getCart();

  if (!cart) throw Error("Cart not found");

  const productInCart = cart?.items.find(
    (item) => item.productId === productId,
  );

  if (productInCart) {
    if (newQuantity === 0) {
      await prisma.cartItem.delete({
        where: { id: productInCart.id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: productInCart.id },
        data: { quantity: newQuantity },
      });
    }
  }

  // refresh the page in server action (???)
  revalidatePath("/cart");
}

export async function removeProduct(productId: string) {
  const cart = await getCart();

  if (!cart) throw Error("Cart not found");

  const productInCart = cart?.items.find(
    (item) => item.productId === productId,
  );

  if (productInCart) {
    await prisma.cartItem.delete({
      where: { id: productInCart.id },
    });
  }

  // refresh the page in server action (???)
  revalidatePath("/cart");
}
