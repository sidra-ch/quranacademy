import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-[#0F766E]/25 bg-white/80 px-4 py-2 text-sm text-[#111827] shadow-sm outline-none placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/30",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
