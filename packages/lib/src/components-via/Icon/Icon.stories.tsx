import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { Icon, LocalGlyphName } from ".";

export default {
  component: Icon,
} satisfies CustomMeta<typeof Icon>;

const localGlyphs: LocalGlyphName[] = [
  "EvergreenLogo",
  "GitHub",
  "KnownFailure",
];

export const LocalGlyphs: CustomStoryObj<typeof Icon> = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      {localGlyphs.map((glyph) => (
        <div key={glyph} style={{ textAlign: "center" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Icon glyph={glyph} size="small" />
            <Icon glyph={glyph} />
            <Icon glyph={glyph} size="large" />
            <Icon glyph={glyph} size={32} />
          </div>
          <div>{glyph}</div>
        </div>
      ))}
    </div>
  ),
};

export const ViaGlyphPassthrough: CustomStoryObj<typeof Icon> = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Icon glyph="Checkmark" />
      <Icon fill="red" glyph="Warning" />
    </div>
  ),
};
