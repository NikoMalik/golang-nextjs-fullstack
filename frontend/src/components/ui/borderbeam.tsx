import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: BorderBeamProps) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "relative rounded-full",
        `border-[calc(${borderWidth}px)_solid_transparent]`,
        "after:absolute after:w-full after:h-full after:rounded-full after:animate-border-beam after:content-[''] after:[animation-delay:var(--delay)] after:[border:calc(var(--border-width)*1px)_solid_var(--color-from)]",
        "after:after:content-[''] after:after:[border:calc(var(--border-width)*1px)_solid_var(--color-to)]",
        "after:after:after:content-[''] after:after:after:[border:calc(var(--border-width)*1px)_solid_transparent]",
        className,
      )}
    />
  );
};

