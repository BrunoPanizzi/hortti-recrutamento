"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "~/hooks/useAuth";
import { useProducts, useDeleteProduct } from "~/hooks/useProducts";
import { Product } from "~/services/client/ProductService";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Search } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth("/login");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-400">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Bem-vindo, {user.name}!</h1>
        </div>
        <Link href="/novo-produto">
          <Button>
            <span className="text-xl mr-2">+</span>
            Novo Produto
          </Button>
        </Link>
      </div>

      <ProductsList userId={user.id} />
    </div>
  );
}

function ProductsList({ userId }: { userId: number }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getSortParams = () => {
    if (sortBy === "name") {
      return { sortBy: "name" as const, sortOrder: "asc" as const };
    } else if (sortBy === "price-asc") {
      return { sortBy: "price" as const, sortOrder: "asc" as const };
    } else {
      return { sortBy: "price" as const, sortOrder: "desc" as const };
    }
  };

  const { sortBy: apiSortBy, sortOrder } = getSortParams();

  const { data: products, error, isLoading } = useProducts({
    search: debouncedSearch || undefined,
    sortBy: apiSortBy,
    sortOrder: sortOrder,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Buscar produtos por nome ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="md:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full h-9 px-3 rounded-xs bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="price-asc">Preço: Menor para Maior</option>
            <option value="price-desc">Preço: Maior para Menor</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-zinc-400">Carregando produtos...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">Erro ao carregar produtos: {error.message}</p>
        </div>
      )}

      {!isLoading && !error && debouncedSearch && (
        <p className="text-sm text-zinc-400">
          {products?.length === 0
            ? "Nenhum produto encontrado"
            : `${products?.length} ${
                products?.length === 1 ? "produto encontrado" : "produtos encontrados"
              }`}
        </p>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!isLoading && !error && products?.length === 0 && !debouncedSearch && (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">Você ainda não tem produtos cadastrados.</p>
          <Link href="/novo-produto">
            <Button>Criar Primeiro Produto</Button>
          </Link>
        </div>
      )}
    </div>
  );
}


type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleEdit = () => {
    router.push(`/editar-produto/${product.id}`);
  };

  const handleDelete = () => {
    if (
      confirm(
        `Tem certeza que deseja excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`
      )
    ) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="border border-zinc-700 rounded-lg overflow-hidden bg-zinc-800/50 hover:border-zinc-600 transition-colors">
      <div className="relative h-48 w-full bg-zinc-900">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <span className="text-4xl">📦</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-800/90 via-zinc-800/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white drop-shadow-lg">
              {product.name}
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-zinc-700/50 transition-colors">
                  <MoreVertical className="w-5 h-5 text-white drop-shadow-lg" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="w-4 h-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-100 border border-cyan-500/30">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Preço</p>
            <p className="text-lg font-semibold text-zinc-100">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Estoque</p>
            <p className="text-lg font-semibold text-zinc-100">
              {product.stock}
            </p>
          </div>
        </div>

        {(product.volume !== null || product.weight !== null) && (
          <div className="flex gap-4 pt-2 border-t border-zinc-700">
            {product.volume !== null && (
              <div className="flex-1">
                <p className="text-xs text-zinc-500">Volume</p>
                <p className="text-sm text-zinc-300">{product.volume} m³</p>
              </div>
            )}
            {product.weight !== null && (
              <div className="flex-1">
                <p className="text-xs text-zinc-500">Peso</p>
                <p className="text-sm text-zinc-300">{product.weight} kg</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}