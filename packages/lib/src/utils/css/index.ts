/**
 * Joins class names together, skipping falsy values. Useful for combining CSS
 * module classes with conditional and consumer-provided class names.
 * @param classNames - class names to join; falsy values are omitted
 * @returns a single space-separated class name string
 * @example
 * cx(styles.wordBreak, all && styles.breakAll, className)
 */
export const cx = (
  ...classNames: (string | false | undefined | null)[]
): string => classNames.filter(Boolean).join(" ");
