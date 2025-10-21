import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "~/services/client/AuthService";

export function useAuth(redirectTo?: string) {
  const router = useRouter();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      return authService.me();
    },
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [isLoading, isError, user, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthenticated: !isError && !!user,
  };
}
