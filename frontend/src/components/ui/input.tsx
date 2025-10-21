import * as React from "react";

import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-zinc-50 placeholder:text-zinc-400 selection:bg-zinc-500 selection:text-zinc-50 bg-zinc-700 border-zinc-600 h-9 w-full min-w-0 rounded-xs border px-3 py-1 text-base text-zinc-50 shadow-xs transition-[color,box-shadow,background-color,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:bg-zinc-600 hover:border-zinc-500",
        "focus-visible:bg-zinc-600 focus-visible:border-zinc-500 focus-visible:ring-zinc-500/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
