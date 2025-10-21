"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCreateProduct } from "~/hooks/useProducts";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [volume, setVolume] = useState("");
  const [weight, setWeight] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const { mutate: createProduct, isPending, isError, error } = useCreateProduct({
    onSuccess: () => {
      // Clear form
      setName("");
      setCategory("");
      setPrice("");
      setStock("");
      setVolume("");
      setWeight("");
      setImageFile(undefined);
      // Reset file input
      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      // Redirect to home
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      ...(volume && { volume: Number(volume) }),
      ...(weight && { weight: Number(weight) }),
    };

    createProduct({ payload, image: imageFile });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file);
  };

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Criar Novo Produto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nome <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Nome do produto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
              >
                Categoria <span className="text-red-500">*</span>
              </label>
              <Input
                id="category"
                name="category"
                type="text"
                required
                placeholder="Categoria do produto"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-2"
                >
                  Preço (R$) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium mb-2"
                >
                  Estoque <span className="text-red-500">*</span>
                </label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Volume and Weight (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="volume"
                  className="block text-sm font-medium mb-2"
                >
                  Volume (m³) <span className="text-zinc-500">(opcional)</span>
                </label>
                <Input
                  id="volume"
                  name="volume"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium mb-2"
                >
                  Peso (kg) <span className="text-zinc-500">(opcional)</span>
                </label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2">
                Imagem <span className="text-zinc-500">(opcional)</span>
              </label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isPending}
              />
              {imageFile && (
                <p className="text-sm text-zinc-400 mt-2">
                  Arquivo selecionado: {imageFile.name}
                </p>
              )}
            </div>
          </div>

          {isError && (
            <div className="text-red-500 text-sm">
              {error?.message || "Erro ao criar produto"}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Criando..." : "Criar Produto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={isPending}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
