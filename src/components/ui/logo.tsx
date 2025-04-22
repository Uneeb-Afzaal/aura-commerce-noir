
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn("font-bold text-xl tracking-tighter", className)} {...props}>
      <span className="text-gold">AURA</span>
      <span className="text-foreground">&nbsp;NOIR</span>
    </div>
  );
}
