import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type SectionTitleProps = {
  label?: string;
  title?: React.ReactNode;
  text?: React.ReactNode;
  align?: "left" | "center" | "right";
  children?: React.ReactNode;
  className?: string;
};

export function SectionTitle({
  label,
  title,
  text,
  align = "left",
  children,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center",
        {
          "xl:items-start": align === "left",
          "justify-end": align === "right",
        },
        className,
      )}
    >
      <span
        className={cn("text-xl font-bold text-default-foreground text-center text-orange-500", {
          "xl:text-left": align === "left",
          "xl:text-right": align === "right",
        })}
      >
        {label}
      </span>
      <h2
        className={cn(
          "text-[28px] sm:pb-3 sm:text-[52px] sm:leading-[64px] text-foreground text-pretty max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl via-30/%  pt-4 font-bold  text-center leading-none",
          { "xl:text-left": align === "left", "xl:text-right": align === "right" },
        )}
      >
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            "text-sm md:text-base text-foreground/50 leading-7 py-6 text-center max-w-sm md:max-w-md lg:max-w-xl xl:max-w-4xl text-balance",
            {
              "xl:text-left xl:max-w-xl": align === "left",
              "xl:text-right xl:max-w-xl": align === "right",
            },
          )}
        >
          {text}
        </p>
      )}
      {children}
    </div>
  );
}

export const Section: React.FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return <section className={cn(className)}>{children}</section>;
};