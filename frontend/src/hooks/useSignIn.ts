import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  authService,
  type SignInPayload,
  type SignInResponse,
} from "~/services/client/AuthService";

type UseSignInOptions = Omit<
  UseMutationOptions<SignInResponse, Error, SignInPayload>,
  "mutationFn"
>;

export function useSignIn(options?: UseSignInOptions) {
  return useMutation<SignInResponse, Error, SignInPayload>({
    mutationFn: async (data: SignInPayload) => {
      return authService.signIn(data);
    },
    ...options,
  });
}
