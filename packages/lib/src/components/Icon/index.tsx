import { forwardRef } from "react";
import {
  type DynamicIconProps,
  type GlyphName,
  Icon as ViaIcon,
  sizeMap,
} from "@via-ds/icons";
import "@via-ds/icons/styles.css";
import AnimatedIcon from "./AnimatedIcon";
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

export interface IconProps extends Omit<DynamicIconProps, "glyph"> {
  glyph: GlyphName | LocalGlyphName;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ glyph, size, ...rest }, ref) => {
    // LG's IconButton cloneElements icons with the legacy "default" size key;
    // Via calls that size "medium".
    const normalizedSize = (size as string) === "default" ? "medium" : size;
    if (glyph in localGlyphs) {
      const LocalGlyph = localGlyphs[glyph as LocalGlyphName];
      return <LocalGlyph ref={ref} size={normalizedSize} {...rest} />;
    }
    // Pin the default so Via's IconContext can't resize glyphs (LG had no
    // context); keeps this barrel identical to the LG one it replaced.
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
// LG components (SideNavGroup, etc.) gate glyph slots on the isGlyph marker.
Object.assign(Icon, { isGlyph: true });

export { sizeMap, localGlyphs };

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
