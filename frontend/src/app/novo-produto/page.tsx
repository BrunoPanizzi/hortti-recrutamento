"use client";

import { useRouter } from "next/navigation";
import { useCreateProduct } from "~/hooks/useProducts";
import { ProductForm, type ProductFormData } from "~/components/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  const { mutate: createProduct, isPending, isError, error } = useCreateProduct({
    onSuccess: () => {
      // Redirect to home
      router.push("/");
    },
  });

  const handleSubmit = (data: ProductFormData) => {
    const payload = {
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      ...(data.volume && { volume: Number(data.volume) }),
      ...(data.weight && { weight: Number(data.weight) }),
    };

    createProduct({ payload, image: data.image });
  };

  return (
    <ProductForm
      title="Criar Novo Produto"
      onSubmit={handleSubmit}
      onCancel={() => router.push("/")}
      isSubmitting={isPending}
      isError={isError}
      error={error}
      submitButtonText="Criar Produto"
    />
  );
}
