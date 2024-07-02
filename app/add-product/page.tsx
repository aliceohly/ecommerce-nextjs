import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import FormSubmitButton from "../components/FormSubmitButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mockData from "./mockData.json";

export const metadata = { title: "Add Product" };

async function addProduct(formData: FormData) {
  "use server";

  // protect submit form button with auth
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin?callbackUrl=/add-product");

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = formData.get("price")?.toString();

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, description, imageUrl, price: parseInt(price) },
  });

  // add mock data
  // const products = mockData;

  // for (const product of products) {
  //   await prisma.product.create({
  //     data: product,
  //   });
  // }

  redirect("/");
}

export default async function AddProductPage() {
  // protect route with auth
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin?callbackUrl=/add-product");

  return (
    <div>
      <div className="text-lg font-bold">Add Product</div>
      <form action={addProduct}>
        <input
          required
          type="text"
          name="name"
          placeholder="Product Name"
          className="input input-bordered mb-3 w-full"
        />
        <textarea
          required
          name="description"
          className="textarea textarea-bordered w-full"
          placeholder="Description"
        />
        <input
          required
          type="url"
          name="imageUrl"
          placeholder="Url"
          className="input input-bordered mb-3 w-full"
        />
        <input
          required
          type="number"
          name="price"
          placeholder="price"
          className="input input-bordered mb-3 w-full"
        />
        <FormSubmitButton>Submit</FormSubmitButton>
      </form>
    </div>
  );
}
