"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useSignIn } from "~/hooks/useSignIn";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutate: signIn, isPending, isError, error } = useSignIn({
    onSuccess: () => {
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex w-full h-full justify-center">
      <div className="max-w-md w-full place-self-center space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Entrar</h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="fulano@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isPending}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Senha..."
                value={formData.password}
                onChange={handleChange}
                disabled={isPending}
              />
            </div>
          </div>

          {isError && (
            <div className="text-red-500 text-sm text-center">
              {error?.message || "Erro ao fazer login"}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Não tem uma conta?{" "}
            <a
              href="/signup"
              className="text-cyan-100 hover:text-cyan-200 hover:underline"
            >
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
