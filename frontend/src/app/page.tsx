"use client";

import { useAuth } from "~/hooks/useAuth";

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
    return null; // Will redirect to login
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo, {user.name}!</h1>
      <p className="text-zinc-400">Email: {user.email}</p>
    </div>
  );
}
