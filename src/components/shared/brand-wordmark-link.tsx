import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND_SYMBOL_SRC, BRAND_WORDMARK } from "@/lib/brand-logo";

type Props = {
  href: string;
  className?: string;
  /** Navbar/footer (navy on light) vs. dashboard sidebar */
  tone?: "light" | "sidebar";
  size?: "sm" | "md" | "lg" | "xl";
  /** Symbol links neben dem Text (z. B. Haupt-Header) */
  withSymbol?: boolean;
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
  withSymbol = false,
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
        withSymbol && "flex items-center gap-3 sm:gap-4",
        className,
      )}
    >
      {withSymbol && (
        <Image
          src={BRAND_SYMBOL_SRC}
          alt=""
          width={80}
          height={80}
          className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10 md:h-11 md:w-11"
          priority
        />
      )}
      <span className="leading-none">{BRAND_WORDMARK}</span>
    </Link>
  );
}
