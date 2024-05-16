"use server"; // without this line the file will be treated as a client file ???

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(productId: string) {
  // Check if cart exists
  // If cart exists, check if product exists in cart
  // If product exists in cart, increment quantity
  // If product does not exist in cart, add product to cart
  // If cart does not exist, create cart and add product to cart

  //   const cart = await createCart();

  const cart = (await getCart()) ?? (await createCart());

  const productInCart = cart?.items.find(
    (item) => item.productId === productId,
  );

  if (productInCart) {
    await prisma.cartItem.update({
      where: { id: productInCart.id },
      data: { quantity: productInCart.quantity + 1 }, // data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });
  }

  // refresh the page in server action (???)
  revalidatePath("/products/[id]");
}
