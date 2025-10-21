import { z } from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const signUpPayloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpResponseSchema = z.object({
  access_token: z.string(),
});

type SignUpPayload = z.infer<typeof signUpPayloadSchema>;
type SignUpResponse = z.infer<typeof signUpResponseSchema>;

const signInPayloadSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInResponseSchema = z.object({
  access_token: z.string(),
});

type SignInPayload = z.infer<typeof signInPayloadSchema>;
type SignInResponse = z.infer<typeof signInResponseSchema>;

const meResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type MeResponse = z.infer<typeof meResponseSchema>;

class AuthService {
  private readonly TOKEN_KEY = "access_token";

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  async signUp(payload: SignUpPayload): Promise<SignUpResponse> {
    const validatedPayload = signUpPayloadSchema.parse(payload);

    const response = await fetch(`${API_BASE_URL}/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedPayload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Sign up failed");
    }

    const data = await response.json();

    const validatedResponse = signUpResponseSchema.parse(data);

    this.setToken(validatedResponse.access_token);

    return validatedResponse;
  }

  async signIn(payload: SignInPayload): Promise<SignInResponse> {
    const validatedPayload = signInPayloadSchema.parse(payload);

    const response = await fetch(`${API_BASE_URL}/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedPayload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Sign in failed");
    }

    const data = await response.json();

    const validatedResponse = signInResponseSchema.parse(data);

    this.setToken(validatedResponse.access_token);

    return validatedResponse;
  }

  async me(token?: string): Promise<MeResponse> {
    const authToken = token || this.getToken();
    
    if (!authToken) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch user data");
    }

    const data = await response.json();

    return meResponseSchema.parse(data);
  }
}

export const authService = new AuthService();
export type { SignUpPayload, SignUpResponse, SignInPayload, SignInResponse, MeResponse };