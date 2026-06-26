import * as React from "react";
import { cn } from "@/lib/utils";

type ShineBorderProps = {
  className?: string;
  duration?: number;
  shineColor?: string | string[];
  borderWidth?: number;
  style?: React.CSSProperties;
};

function ShineBorder({
  className,
  duration = 14,
  shineColor = "#000000",
  borderWidth = 1,
  style,
}: ShineBorderProps & React.ComponentProps<"span">) {
  const gradient = Array.isArray(shineColor)
    ? shineColor.join(", ")
    : shineColor;

  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 z-0 rounded-[inherit]",
        className
      )}
      style={{
        background: `conic-gradient(from var(--shine-angle, 0deg) at 50% 50%, transparent, ${gradient}, transparent 30%)`,
        animation: `shine ${duration}s linear infinite`,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: `${borderWidth}px`,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export { ShineBorder };
