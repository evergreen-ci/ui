// Shared wrapper: apps import Via primitives from here rather than @via-ds
// directly, so cross-cutting changes land in one place. Deprecated aliases
// (ErrorText, subtitle/overline text styles) are intentionally not exported.
export {
  Body,
  Code,
  Description,
  Disclaimer,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  InlineCode,
  InlineKeyCode,
  Label,
  type LabelProps,
  Link,
  type LinkProps,
  LinkStyle,
  type SizableTextAliasProps,
  type SizableTextProps,
  Text,
  type TextAliasProps,
  type TextProps,
  TextStyle,
  type UnsizableTextProps,
} from "@via-ds/components/typography";
