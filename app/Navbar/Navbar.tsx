import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import { redirect } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";
import { getCart } from "@/lib/db/cart";

async function searchProduct(formData: FormData) {
  "use server";

  const product = formData.get("searchQuery")?.toString();

  if (product) redirect("/");
}

export default async function Navbar() {
  const cart = await getCart();

  return (
    <div className="bg-base-100">
      <div className="margin-auto navbar max-w-7xl flex-col sm:flex-row">
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl" href={"/"}>
            <Image src={logo} height={40} width={40} alt="Flowmazon logo" />
            Waw Corp
          </Link>
        </div>
        <div className="flex-none gap-2">
          <form action={searchProduct}>
            <div className="form-control">
              <input
                name="searchQuery"
                type="text"
                placeholder="Search"
                className="input input-bordered"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
        </div>
      </div>
    </div>
  );
}
