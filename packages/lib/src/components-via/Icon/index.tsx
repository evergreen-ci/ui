import { forwardRef } from "react";
import {
  type DynamicIconProps,
  type GlyphName,
  SizeValue,
  Icon as ViaIcon,
  useIconSkeleton,
} from "@via-ds/icons";
// Via's flex-shrink rule for glyphs; imported here so every consumer of the
// wrapper gets it without a separate app-entry import.
import "@via-ds/icons/styles.css";
import { EvergreenLogo } from "./glyphs/EvergreenLogo";
import { GitHub } from "./glyphs/GitHub";
import { KnownFailure } from "./glyphs/KnownFailure";

const localGlyphs = {
  EvergreenLogo,
  GitHub,
  KnownFailure,
} as const;

export type LocalGlyphName = keyof typeof localGlyphs;

const isLocalGlyph = (glyph: string): glyph is LocalGlyphName =>
  glyph in localGlyphs;

export interface IconProps extends Omit<DynamicIconProps, "glyph"> {
  glyph: GlyphName | LocalGlyphName;
}

/**
 * Shared wrapper around the Via `Icon` that also renders the glyphs Via
 * lacks (EvergreenLogo, GitHub, KnownFailure) from local SVGs.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ className, glyph, ...rest }, ref) => {
    // Mirror the Via Icon's skeleton handling for local glyphs: shimmer class
    // plus `inert` while an ancestor Skeleton is loading.
    const { className: skeletonClass, isLoading } = useIconSkeleton();
    if (isLocalGlyph(glyph)) {
      const LocalGlyph = localGlyphs[glyph];
      return (
        <LocalGlyph
          ref={ref}
          className={
            isLoading
              ? [className, skeletonClass].filter(Boolean).join(" ")
              : className
          }
          inert={isLoading ? "" : undefined}
          {...rest}
        />
      );
    }
    return <ViaIcon ref={ref} className={className} glyph={glyph} {...rest} />;
  },
);
Icon.displayName = "Icon";

export { EvergreenLogo, GitHub, KnownFailure, SizeValue };
