import { palette } from "@leafygreen-ui/palette";
import * as via from "@via-ds/icons";
import { IconProps, localGlyphs, sizeMap } from "components/Icon";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import styles from "./IconWithTooltip.stories.module.css";
import IconWithTooltip from ".";

const { green } = palette;

const glyphNames: IconProps["glyph"][] = [
  ...Object.entries(via)
    .filter(([, component]) => (component as via.IconComponent).isGlyph)
    .map(([name]) => name as IconProps["glyph"]),
  ...(Object.keys(localGlyphs) as IconProps["glyph"][]),
].sort();

export default {
  component: IconWithTooltip,
} satisfies CustomMeta<typeof IconWithTooltip>;

export const Default: CustomStoryObj<typeof IconWithTooltip> = {
  argTypes: {
    fill: {
      control: "color",
    },
    size: {
      control: { type: "select" },
      options: Object.values(sizeMap),
    },
    children: {
      control: { type: "text" },
    },
  },
  args: {
    fill: green.dark3,
    size: sizeMap.medium,
    children: "Tooltip Text",
  },
  render: ({ children, ...rest }) => (
    <div className={styles.container}>
      {glyphNames.map((name) => (
        <div key={name} className={styles.iconContainer}>
          <IconWithTooltip {...rest} glyph={name}>
            {children}
          </IconWithTooltip>
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
