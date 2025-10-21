import { z } from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  price: z.coerce.number(),
  stock: z.number(),
  volume: z.number().nullable(),
  weight: z.number().nullable(),
  imageKey: z.string().nullable(),
  imageUrl: z.string().nullable(),
});

const createProductPayloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price is required"),
  stock: z.number().min(0, "Stock must be non-negative"),
  volume: z.number().positive("Volume must be positive").optional(),
  weight: z.number().positive("Weight must be positive").optional(),
});

const updateProductPayloadSchema = createProductPayloadSchema.partial();

const paginatedProductsResponseSchema = z.array(productSchema);

type Product = z.infer<typeof productSchema>;
type CreateProductPayload = z.infer<typeof createProductPayloadSchema>;
type UpdateProductPayload = z.infer<typeof updateProductPayloadSchema>;

interface FindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
}

class ProductService {
  private getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async create(payload: CreateProductPayload, image?: File): Promise<Product> {
    const validatedPayload = createProductPayloadSchema.parse(payload);

    const formData = new FormData();
    formData.append("name", validatedPayload.name);
    formData.append("category", validatedPayload.category);
    formData.append("price", validatedPayload.price.toString());
    formData.append("stock", validatedPayload.stock.toString());
    if (validatedPayload.volume !== undefined) {
      formData.append("volume", validatedPayload.volume.toString());
    }
    if (validatedPayload.weight !== undefined) {
      formData.append("weight", validatedPayload.weight.toString());
    }
    if (image) {
      formData.append("image", image);
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create product");
    }

    const data = await response.json();
    return productSchema.parse(data);
  }

  async findAll(params?: FindAllParams): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await fetch(
      `${API_BASE_URL}/products?${queryParams.toString()}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch products");
    }

    const data = await response.json();
    return paginatedProductsResponseSchema.parse(data);
  }

  async findOne(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch product");
    }

    const data = await response.json();
    return productSchema.parse(data);
  }

  async update(
    id: number,
    payload: UpdateProductPayload,
    image?: File
  ): Promise<void> {
    const validatedPayload = updateProductPayloadSchema.parse(payload);

    const formData = new FormData();
    if (validatedPayload.name !== undefined) {
      formData.append("name", validatedPayload.name);
    }
    if (validatedPayload.category !== undefined) {
      formData.append("category", validatedPayload.category);
    }
    if (validatedPayload.price !== undefined) {
      formData.append("price", validatedPayload.price.toString());
    }
    if (validatedPayload.stock !== undefined) {
      formData.append("stock", validatedPayload.stock.toString());
    }
    if (validatedPayload.volume !== undefined) {
      formData.append("volume", validatedPayload.volume.toString());
    }
    if (validatedPayload.weight !== undefined) {
      formData.append("weight", validatedPayload.weight.toString());
    }
    if (image) {
      formData.append("image", image);
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update product");
    }
  }

  async remove(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to delete product");
    }
  }
}

export const productService = new ProductService();
export type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  FindAllParams,
};
