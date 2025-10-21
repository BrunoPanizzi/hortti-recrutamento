"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useSignup } from "~/hooks/useSignup";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { mutate: signUp, isPending, isError, error } = useSignup({
    onSuccess: () => {
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(formData);
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
          <h1 className="text-2xl font-bold">Criar conta</h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Digite seu nome"
                value={formData.name}
                onChange={handleChange}
                disabled={isPending}
              />
            </div>

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
                placeholder="Digite seu email"
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
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Crie uma senha"
                value={formData.password}
                onChange={handleChange}
                disabled={isPending}
              />
            </div>
          </div>

          {isError && (
            <div className="text-red-500 text-sm text-center">
              {error?.message || "Erro ao criar conta"}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Criando conta..." : "Criar conta"}
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="text-cyan-100 hover:text-cyan-200 hover:underline"
            >
              Faça login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
