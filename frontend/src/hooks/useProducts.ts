import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  productService,
  type Product,
  type CreateProductPayload,
  type UpdateProductPayload,
  type FindAllParams,
} from "~/services/client/ProductService";

const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: FindAllParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export function useProducts(
  params?: FindAllParams,
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<Product[], Error>({
    queryKey: productKeys.list(params),
    queryFn: () => productService.findAll(params),
    staleTime: 0,
    gcTime: 0,
    ...options,
  });
}

export function useProduct(
  id: number,
  options?: Omit<UseQueryOptions<Product, Error>, "queryKey" | "queryFn">
) {
  return useQuery<Product, Error>({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.findOne(id),
    ...options,
  });
}

export function useCreateProduct(
  options?: Omit<
    UseMutationOptions<
      Product,
      Error,
      { payload: CreateProductPayload; image?: File }
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    Product,
    Error,
    { payload: CreateProductPayload; image?: File }
  >({
    mutationFn: ({ payload, image }) => productService.create(payload, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    ...options,
  });
}

export function useUpdateProduct(
  options?: Omit<
    UseMutationOptions<
      void,
      Error,
      { id: number; payload: UpdateProductPayload; image?: File }
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: number; payload: UpdateProductPayload; image?: File }
  >({
    mutationFn: ({ id, payload, image }) =>
      productService.update(id, payload, image),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
    ...options,
  });
}

export function useDeleteProduct(
  options?: Omit<UseMutationOptions<void, Error, number>, "mutationFn">
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => productService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
    },
    ...options,
  });
}
