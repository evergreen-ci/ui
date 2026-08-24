import { forwardRef } from "react";
import {
  type DynamicIconProps,
  type GlyphName,
  Icon as ViaIcon,
  sizeMap,
} from "@via-ds/icons";
import "@via-ds/icons/styles.css";
import AnimatedIcon from "./AnimatedIcon";
import { glyphs } from "./glyphs";
import * as icons from "./icons";

const localGlyphs = {
  EvergreenLogo: icons.EvergreenLogo,
  ParsleyLogo: icons.ParsleyLogo,
  GitHub: icons.GitHub,
  KnownFailure: icons.KnownFailure,
  Expand: icons.Expand,
  ArrowWithCircle: icons.ArrowWithCircle,
  ClosedEye: icons.ClosedEye,
  Ignored: icons.Ignored,
  PrideLogo: icons.PrideLogo,
  FallLogo: icons.FallLogo,
  WinterLogo: icons.WinterLogo,
  SpringLogo: icons.SpringLogo,
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

export interface IconProps extends Omit<DynamicIconProps, "glyph"> {
  glyph: GlyphName | LocalGlyphName;
}

/** Via-backed Icon that also renders local glyphs Via lacks. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ glyph, size, ...rest }, ref) => {
    // LG's IconButton cloneElements icon children with its own size, using the
    // legacy LG key "default". Via's sizeMap calls that size "medium".
    const normalizedSize = (size as string) === "default" ? "medium" : size;
    if (glyph in localGlyphs) {
      const LocalGlyph = localGlyphs[glyph as LocalGlyphName];
      return <LocalGlyph ref={ref} size={normalizedSize} {...rest} />;
    }
    // Via glyphs inherit size from a surrounding IconContext (e.g. inside Via
    // Buttons); LeafyGreen glyphs had no such behavior. Pinning the default
    // keeps this barrel visually identical to the LG one it replaced.
    return (
      <ViaIcon
        ref={ref}
        glyph={glyph as GlyphName}
        size={normalizedSize ?? 16}
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

export { AnimatedIcon };
export {
  EvergreenLogo,
  ParsleyLogo,
  PrideLogo,
  FallLogo,
  WinterLogo,
  SpringLogo,
} from "./icons";

export default Icon;
