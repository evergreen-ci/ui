import { ComponentPropsWithoutRef, forwardRef } from "react";
import { SerializedStyles } from "@emotion/react";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./ElementWrapper.module.css";
import { emotionCssToClassName } from "./utils";

interface ElementWrapperProps extends ComponentPropsWithoutRef<"div"> {
  css?: SerializedStyles | string;
  limitMaxWidth?: boolean;
}

const ElementWrapper = forwardRef<HTMLDivElement, ElementWrapperProps>(
  ({ className, css: cssProp, limitMaxWidth, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx(
        styles.elementWrapper,
        limitMaxWidth && styles.limitMaxWidth,
        emotionCssToClassName(cssProp),
        className,
      )}
      {...rest}
    />
  ),
);
ElementWrapper.displayName = "ElementWrapper";

export default ElementWrapper;
