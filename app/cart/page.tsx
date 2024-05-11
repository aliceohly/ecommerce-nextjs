import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import { formatPrice } from "@/lib/formatPrice";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div>
      <h1 className="mb-5 text-3xl font-bold">Shopping Cart</h1>
      <div className="flex flex-col gap-2 md:flex-row">
        {!cart?.items.length && <div>Your cart is empty.</div>}
        <div>
          {cart?.items.map((item, index) => (
            <>
              {index > 0 && <div className="divider" />}
              <CartEntry key={item.id} item={item} />
            </>
          ))}
        </div>
        <div className="ml-auto w-full bg-[#d8d8d8] p-4 md:max-w-[350px]">
          <div className="text-xs">
            <div className="flex">
              <div className="uppercase">Subtotal</div>{" "}
              <div className="ml-auto font-bold">
                {formatPrice(cart?.subtotal || 0)}
              </div>
            </div>
            <div className="flex">
              <div className="uppercase">Estimated shipping</div>{" "}
              <div className="ml-auto font-bold">Free</div>
            </div>
            <button className="mt-4 w-full rounded bg-neutral px-4 py-2 uppercase text-white">
              proceed to secure checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
