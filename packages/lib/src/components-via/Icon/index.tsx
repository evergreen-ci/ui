import { forwardRef } from "react";
import {
  type DynamicIconProps,
  type GlyphName,
  SizeValue,
  Icon as ViaIcon,
} from "@via-ds/icons";
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
  ({ glyph, ...rest }, ref) => {
    if (isLocalGlyph(glyph)) {
      const LocalGlyph = localGlyphs[glyph];
      return <LocalGlyph ref={ref} {...rest} />;
    }
    return <ViaIcon ref={ref} glyph={glyph} {...rest} />;
  },
);
Icon.displayName = "Icon";

export { EvergreenLogo, GitHub, KnownFailure, SizeValue };
