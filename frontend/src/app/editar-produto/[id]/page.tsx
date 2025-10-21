"use client";

import { useRouter, useParams } from "next/navigation";
import { useProduct, useUpdateProduct } from "~/hooks/useProducts";
import { ProductForm, type ProductFormData } from "~/components/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const {
    data: product,
    isLoading,
    error: fetchError,
  } = useProduct(productId);

  const {
    mutate: updateProduct,
    isPending,
    isError,
    error,
  } = useUpdateProduct({
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

    updateProduct({ id: productId, payload, image: data.image });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-400">Carregando produto...</p>
      </div>
    );
  }

  if (fetchError || !product) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {fetchError?.message || "Produto não encontrado"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-cyan-400 hover:underline"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      title="Editar Produto"
      initialValues={{
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        volume: product.volume?.toString() || "",
        weight: product.weight?.toString() || "",
      }}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/")}
      isSubmitting={isPending}
      isError={isError}
      error={error}
      submitButtonText="Atualizar Produto"
    />
  );
}
