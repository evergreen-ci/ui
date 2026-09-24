import type { GlyphComponent } from "@via-ds/icons";
import ArrowDown from "@via-ds/icons/ArrowDown";
import ArrowUp from "@via-ds/icons/ArrowUp";
import CaretDown from "@via-ds/icons/CaretDown";
import CaretRight from "@via-ds/icons/CaretRight";
import CaretUp from "@via-ds/icons/CaretUp";
import Checkmark from "@via-ds/icons/Checkmark";
import CheckmarkWithCircle from "@via-ds/icons/CheckmarkWithCircle";
import ChevronRight from "@via-ds/icons/ChevronRight";
import CurlyBraces from "@via-ds/icons/CurlyBraces";
import Ellipsis from "@via-ds/icons/Ellipsis";
import File from "@via-ds/icons/File";
import Filter from "@via-ds/icons/Filter";
import Highlight from "@via-ds/icons/Highlight";
import ImportantWithCircle from "@via-ds/icons/ImportantWithCircle";
import InfoWithCircle from "@via-ds/icons/InfoWithCircle";
import Key from "@via-ds/icons/Key";
import MagnifyingGlass from "@via-ds/icons/MagnifyingGlass";
import Pause from "@via-ds/icons/Pause";
import Play from "@via-ds/icons/Play";
import Trash from "@via-ds/icons/Trash";
import Warning from "@via-ds/icons/Warning";
import XWithCircle from "@via-ds/icons/XWithCircle";

/**
 * The Via glyphs reachable through `<Icon glyph="..." />`.
 *
 * Resolving a glyph from a runtime string is what Via's own name-keyed `Icon`
 * does, and it costs the whole 188-glyph set (~322 kB raw) no matter how few
 * are rendered. Listing them here keeps the string-keyed API while the bundler
 * sees ordinary static imports.
 *
 * Add an entry when a glyph is genuinely name-addressed. When the glyph is
 * known at the call site, import it directly — `@via-ds/icons/Cloud` — rather
 * than routing it through here.
 */
const glyphs = {
  ArrowDown,
  ArrowUp,
  CaretDown,
  CaretRight,
  CaretUp,
  Checkmark,
  CheckmarkWithCircle,
  ChevronRight,
  CurlyBraces,
  Ellipsis,
  File,
  Filter,
  Highlight,
  ImportantWithCircle,
  InfoWithCircle,
  Key,
  MagnifyingGlass,
  Pause,
  Play,
  Trash,
  Warning,
  XWithCircle,
} as const;

export type ViaGlyphName = keyof typeof glyphs;

// Via generates each glyph with forwardRef but declares it as `IconComponent`
// (`ComponentType<IconProps>`), which drops the ref from the public type.
export const viaGlyphs = glyphs as Record<ViaGlyphName, GlyphComponent>;
