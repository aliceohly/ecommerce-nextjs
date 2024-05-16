import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ??
export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export type CartItem = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export async function getCart(): Promise<ShoppingCart | null> {
  // Get session id from next auth, if exists, check in db, return user cart
  // If not, check in cookie, return local cart

  let cart: CartWithProducts | null = null;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: { userId: userId },
      include: { items: { include: { product: true } } },
    });
  } else {
    // Get local cart id from cookie, if exists, check in Prisma
    // If not, return null
    const localCardId = cookies().get("localCartId")?.value;
    cart = localCardId
      ? await prisma.cart.findUnique({
          where: { id: localCardId },
          include: { items: { include: { product: true } } },
        })
      : null;
  }

  console.log(`userId`, userId, `cart`, cart);

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
  // Get session from next auth
  const session = await getServerSession(authOptions);
  // Could not get user id from session with error "Property 'id' does not exist on type '{ name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; }'."
  // To solve it need to add type with callback in route.ts
  const userId = session?.user?.id;

  let newCart: Cart;

  if (session) {
    // Create cart with user id
    newCart = await prisma.cart.create({
      data: { userId: userId },
    });
  } else {
    // Create annoumous cart
    newCart = await prisma.cart.create({
      data: {},
    });

    cookies().set("localCartId", newCart.id);
  }

  return { ...newCart, items: [], size: 0, subtotal: 0 };
}

// Merge annoumous cart with sign-in user cart
export async function mergeCarts() {
  // Sudocode
  // Get session from next auth
  // Get local cart id from cookie
  // Return if local cart does not exist
  // Within a transaction:
  // If session exists and local cart id exists, merge local cart with user cart
  // If session exists and local cart id does not exist, do nothing
  // If session does not exist, create all items in local cart in user cart
  // Delete local cart and cookie

  const session = await getServerSession(authOptions);
  const userCart = await prisma.cart.findFirst({
    where: { userId: session?.user?.id },
    include: { items: true },
  });

  const localCardId = cookies().get("localCartId")?.value;
  const localCart = await prisma.cart.findUnique({
    where: { id: localCardId },
    include: { items: true },
  });

  if (!localCart) return;

  await prisma.$transaction(async (prisma) => {
    if (userCart) {
      const mergedCart = mergeCartItems(userCart.items, localCart.items);

      await prisma.cart.create({
        data: {
          userId: session?.user?.id,
          items: {
            createMany: {
              data: mergedCart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    } else {
      await prisma.cart.create({
        data: {
          userId: session?.user?.id,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }
  });

  await prisma.cart.delete({ where: { id: localCardId } });
  cookies().set("localCartId", "");
}

export function mergeCartItems(...cartItemsArrays: CartItem[][]): CartItem[] {
  const combinedItems: CartItem[] = cartItemsArrays.flat();

  const mergedItems = combinedItems.reduce((acc, item) => {
    const existingItem = acc.find(
      (existingItem) => existingItem.productId === item.productId,
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push(item);
    }

    return acc;
  }, [] as CartItem[]);

  return mergedItems;
}
