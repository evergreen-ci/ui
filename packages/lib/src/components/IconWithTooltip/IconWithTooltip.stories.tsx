import { palette } from "@leafygreen-ui/palette";
import { Size, glyphs } from "components/Icon";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import styles from "./IconWithTooltip.stories.module.css";
import IconWithTooltip from ".";

const { green } = palette;

const Sizes = {
  small: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
};

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
      options: Object.values(Sizes),
    },
    children: {
      control: { type: "text" },
    },
  },
  args: {
    fill: green.dark3,
    size: Sizes.medium,
    children: "Tooltip Text",
  },
  render: ({ children, ...rest }) => (
    <div className={styles.container}>
      {Object.keys(glyphs).map((name) => (
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
