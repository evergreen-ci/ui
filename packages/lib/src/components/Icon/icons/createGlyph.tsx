import { forwardRef, useId } from "react";
import {
  type IconProps,
  generateAccessibleProps,
  sizeMap,
} from "@via-ds/icons";
import styles from "./glyphs.module.css";

export type GlyphProps = IconProps;

export type GlyphComponent = React.ForwardRefExoticComponent<
  GlyphProps & React.RefAttributes<SVGSVGElement>
> & { isGlyph: boolean };

interface CreateGlyphOptions {
  label?: string;
  /**
   * Default color applied when the consumer does not pass a `fill` prop.
   * Mirrors LeafyGreen glyph defaults while still allowing Via-style
   * currentColor overrides.
   */
  defaultFill?: string;
  /**
   * Size rendered when the consumer passes no `size`, for glyphs with an
   * intrinsic designed size (logos). Defaults to Via's medium (16px).
   */
  defaultSize?: number;
  /** Extra attributes spread onto the root svg (e.g. shapeRendering). */
  svgProps?: React.SVGProps<SVGSVGElement>;
}

// Builds a glyph matching @via-ds/icons' generated-glyph contract (sizeMap
// resolution, accessible props, slot="icon", isGlyph) for local SVGs.
const createGlyph = (
  name: string,
  viewBox: string,
  content: React.ReactNode,
  options: CreateGlyphOptions = {},
): GlyphComponent => {
  const { defaultFill, defaultSize, label, svgProps } = options;
  const Glyph = forwardRef<SVGSVGElement, GlyphProps>(
    (
      {
        "aria-label": ariaLabel = label,
        "aria-labelledby": ariaLabelledby,
        className,
        fill,
        role = "img",
        size,
        slot = "icon",
        style,
        title,
        ...rest
      },
      ref,
    ) => {
      const titleId = useId();
      const resolvedSize = size ?? defaultSize ?? sizeMap.medium;
      const computedSize =
        typeof resolvedSize === "number" ? resolvedSize : sizeMap[resolvedSize];
      return (
        <svg
          ref={ref}
          className={className ? `${styles.icon} ${className}` : styles.icon}
          fill="none"
          height={computedSize}
          role={role}
          style={
            fill != null || defaultFill != null
              ? { ...style, color: fill ?? defaultFill }
              : style
          }
          viewBox={viewBox}
          width={computedSize}
          xmlns="http://www.w3.org/2000/svg"
          // React 18's SVG prop types omit `slot` (used by
          // react-aria-components to place icons inside components like
          // Button), so it goes through a cast.
          {...({ slot } as React.SVGProps<SVGSVGElement>)}
          {...svgProps}
          {...generateAccessibleProps(role, name, {
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledby,
            title,
            titleId,
          })}
          {...rest}
        >
          {title ? <title id={titleId}>{title}</title> : null}
          {content}
        </svg>
      );
    },
  );
  Glyph.displayName = name;
  return Object.assign(Glyph, { isGlyph: true });
};

export default createGlyph;
