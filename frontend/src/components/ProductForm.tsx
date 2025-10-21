"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export type ProductFormData = {
  name: string;
  category: string;
  price: string;
  stock: string;
  volume?: string;
  weight?: string;
  image?: File;
};

type ProductFormProps = {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isError?: boolean;
  error?: Error | null;
  submitButtonText?: string;
  title: string;
};

export function ProductForm({
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  isError = false,
  error = null,
  submitButtonText = "Salvar",
  title,
}: ProductFormProps) {
  const [name, setName] = useState(initialValues.name || "");
  const [category, setCategory] = useState(initialValues.category || "");
  const [price, setPrice] = useState(initialValues.price || "");
  const [stock, setStock] = useState(initialValues.stock || "");
  const [volume, setVolume] = useState(initialValues.volume || "");
  const [weight, setWeight] = useState(initialValues.weight || "");
  const [imageFile, setImageFile] = useState<File | undefined>(
    initialValues.image
  );

  // Update form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues.name !== undefined) setName(initialValues.name);
    if (initialValues.category !== undefined)
      setCategory(initialValues.category);
    if (initialValues.price !== undefined) setPrice(initialValues.price);
    if (initialValues.stock !== undefined) setStock(initialValues.stock);
    if (initialValues.volume !== undefined) setVolume(initialValues.volume);
    if (initialValues.weight !== undefined) setWeight(initialValues.weight);
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      name,
      category,
      price,
      stock,
      volume,
      weight,
      image: imageFile,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file);
  };

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              {error?.message || "Erro ao salvar produto"}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Salvando..." : submitButtonText}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
