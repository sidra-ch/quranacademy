import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-[#0F766E]/25 bg-white/80 px-4 py-3 text-sm text-[#111827] shadow-sm outline-none placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/30",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
