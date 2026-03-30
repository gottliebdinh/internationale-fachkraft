import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_WORDMARK } from "@/lib/brand-logo";

type Props = {
  href: string;
  className?: string;
  /** Navbar/footer (navy on light) vs. dashboard sidebar */
  tone?: "light" | "sidebar";
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClass: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-base font-semibold",
  md: "text-lg font-semibold",
  lg: "text-xl font-semibold sm:text-2xl",
  xl: "text-2xl font-semibold sm:text-3xl",
};

export function BrandWordmarkLink({
  href,
  className,
  tone = "light",
  size = "md",
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "font-serif tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md",
        tone === "sidebar"
          ? "text-sidebar-foreground focus-visible:ring-sidebar-ring"
          : "text-[#0A2240] dark:text-foreground focus-visible:ring-ring",
        sizeClass[size],
        className,
      )}
    >
      {BRAND_WORDMARK}
    </Link>
  );
}
