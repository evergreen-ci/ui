import { forwardRef } from "react";
import {
  type DynamicIconProps,
  type GlyphName,
  Icon as ViaIcon,
  sizeMap,
} from "@via-ds/icons";
// Via's flex-shrink rule for glyphs; imported here so every consumer of the
// barrel gets it without a separate app-entry import.
import "@via-ds/icons/styles.css";
import AnimatedIcon from "./AnimatedIcon";
import { glyphs } from "./glyphs";
import * as icons from "./icons";
import { FallLogo } from "./icons/logos/FallLogo";
import { PrideLogo } from "./icons/logos/PrideLogo";
import { SpringLogo } from "./icons/logos/SpringLogo";
import { WinterLogo } from "./icons/logos/WinterLogo";

const localGlyphs = {
  EvergreenLogo: icons.EvergreenLogo,
  ParsleyLogo: icons.ParsleyLogo,
  GitHub: icons.GitHub,
  KnownFailure: icons.KnownFailure,
  Expand: icons.Expand,
  ArrowWithCircle: icons.ArrowWithCircle,
  ClosedEye: icons.ClosedEye,
  Ignored: icons.Ignored,
} as const;

export type LocalGlyphName = keyof typeof localGlyphs;

/**
 * LeafyGreen-compatible Size enum. Values map to Via size strings and resolve
 * to the same pixel dimensions as before:
 *  - Small  -> 14px
 *  - Default / medium -> 16px
 *  - Large  -> 20px
 *  - XLarge -> 24px
 */
export enum Size {
  Small = "small",
  Default = "medium",
  Large = "large",
  XLarge = "xlarge",
}

/** Size values accepted by the Icon component. */
type IconSize = number | Size | "small" | "medium" | "large" | "xlarge";

export interface IconProps extends Omit<DynamicIconProps, "glyph" | "size"> {
  glyph: GlyphName | LocalGlyphName;
  /**
   * Via 0.0.2-canary.0 does not include an `xlarge` preset, but LeafyGreen
   * consumers rely on it. We accept it and map it to 24px below.
   */
  size?: IconSize;
}

/** Via-backed Icon that also renders local glyphs Via lacks. */
const xlargeSize = 24;

const resolveSize = (
  size: IconSize | undefined,
): number | "small" | "medium" | "large" | undefined => {
  if ((size as string) === Size.XLarge || (size as string) === "xlarge") {
    return xlargeSize;
  }
  return size as number | "small" | "medium" | "large" | undefined;
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ className, glyph, size, ...rest }, ref) => {
    const resolvedSize = resolveSize(size);
    if (glyph in localGlyphs) {
      const LocalGlyph = localGlyphs[glyph as LocalGlyphName];
      return (
        <LocalGlyph
          ref={ref}
          className={className}
          size={resolvedSize}
          {...rest}
        />
      );
    }
    return (
      <ViaIcon
        ref={ref}
        className={className}
        glyph={glyph as GlyphName}
        size={resolvedSize}
        {...rest}
      />
    );
  },
);
Icon.displayName = "Icon";

// Re-export the Via size map for consumers that need the underlying
// contract.
export { sizeMap };

// Re-export the glyph name registry so stories and type guards can enumerate
// every available icon.
export { glyphs };

export { AnimatedIcon, PrideLogo, FallLogo, WinterLogo, SpringLogo };
export { EvergreenLogo, ParsleyLogo } from "./icons";

export default Icon;
