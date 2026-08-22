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
}

/**
 * Builds a glyph component matching the contract of `@via-ds/icons`' generated
 * glyphs (context-aware size resolution, accessible props, `slot="icon"`,
 * `isGlyph` marker), so local SVGs behave identically to Via's own inside
 * Via components.
 * @param name - Glyph name, used for the display name and accessible label.
 * @param viewBox - The SVG viewBox matching the glyph's path coordinates.
 * @param content - The SVG contents.
 * @param options - Optional label override, default fill, and color-preservation flag.
 * @returns The glyph component.
 */
const createGlyph = (
  name: string,
  viewBox: string,
  content: React.ReactNode,
  options: CreateGlyphOptions = {},
): GlyphComponent => {
  const { defaultFill, label } = options;
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
      const resolvedSize = size ?? sizeMap.medium;
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
