import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { authService, type SignUpPayload, type SignUpResponse } from "~/services/client/AuthService";

type UseSignupOptions = Omit<
  UseMutationOptions<SignUpResponse, Error, SignUpPayload>,
  "mutationFn"
>;

export function useSignup(options?: UseSignupOptions) {
  return useMutation<SignUpResponse, Error, SignUpPayload>({
    mutationFn: async (data: SignUpPayload) => {
      return authService.signUp(data);
    },
    ...options,
  });
}
