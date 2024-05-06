import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import FormSubmitButton from "../components/FormSubmitButton";

export const metadata = { title: "Add Product" };

async function addProduct(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = formData.get("price")?.toString();

  console.log({ name, description, imageUrl, price });

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, description, imageUrl, price: parseInt(price) },
  });

  //   redirect("/");
}

export default function AddProductPage() {
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
