import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import { redirect } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";
import { getCart } from "@/lib/db/cart";
import UserMenuButton from "./UserMenuButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function searchProduct(formData: FormData) {
  "use server";

  const product = formData.get("searchQuery")?.toString();

  if (product) redirect("/");
}

export default async function Navbar() {
  const cart = await getCart();
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-base-100">
      <div className="navbar m-auto max-w-7xl flex-col sm:flex-row">
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl" href={"/"}>
            <Image src={logo} height={40} width={40} alt="Flowmazon logo" />
            Snacky
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
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  );
}
