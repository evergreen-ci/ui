import { forwardRef, useId } from "react";
import {
  type IconProps,
  generateAccessibleProps,
  sizeMap,
  useIconContextSize,
} from "@via-ds/icons";
import styles from "./glyphs.module.css";

export type GlyphComponent = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
> & { isGlyph: boolean };

/**
 * Builds a glyph component matching the contract of `@via-ds/icons`' generated
 * glyphs (context-aware size resolution, accessible props, `slot="icon"`,
 * `isGlyph` marker), so local SVGs behave identically to Via's own inside
 * Via components.
 * @param name - Glyph name, used for the display name and accessible label.
 * @param viewBox - The SVG viewBox matching the glyph's path coordinates.
 * @param content - The SVG contents, drawn with `currentColor`.
 * @returns The glyph component.
 */
const createGlyph = (
  name: string,
  viewBox: string,
  content: React.ReactNode,
): GlyphComponent => {
  const Glyph = forwardRef<SVGSVGElement, IconProps>(
    (
      {
        "aria-label": ariaLabel,
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
      const contextSize = useIconContextSize();
      const resolvedSize = size ?? contextSize ?? sizeMap.medium;
      const computedSize =
        typeof resolvedSize === "number" ? resolvedSize : sizeMap[resolvedSize];
      return (
        <svg
          ref={ref}
          className={className ? `${styles.icon} ${className}` : styles.icon}
          fill="none"
          height={computedSize}
          role={role}
          style={fill != null ? { ...style, color: fill } : style}
          viewBox={viewBox}
          width={computedSize}
          xmlns="http://www.w3.org/2000/svg"
          // React 18's SVG prop types omit `slot`, which react-aria-components
          // uses to place icons inside components like Button.
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
