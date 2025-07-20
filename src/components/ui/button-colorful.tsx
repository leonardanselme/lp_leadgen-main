import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function ButtonColorful({
  className,
  label = "Explore Components",
  ...props
}: ButtonColorfulProps) {
  return (
    <Button
      className={cn(
        "relative h-10 px-6",
        "bg-[#cc0000] rounded-md",
        "transition-all duration-300",
        "group whitespace-nowrap",
        className
      )}
      {...props}
    >
      {/* Gradient background effect */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-[#e60000] via-[#ff1a1a] to-[#e60000]",
          "opacity-40 group-hover:opacity-100",
          "transition-all duration-300 ease-in-out",
          "rounded-md"
        )}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-white font-medium">{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-white" />
      </div>
    </Button>
  );
}
