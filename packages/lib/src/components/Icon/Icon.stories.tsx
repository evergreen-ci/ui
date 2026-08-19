import { palette } from "@leafygreen-ui/palette";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import styles from "./Icon.stories.module.css";
import Icon, { Size, glyphs } from ".";

const { green } = palette;

const Sizes = {
  small: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
};

export default {
  component: Icon,
} satisfies CustomMeta<typeof Icon>;

export const Default: CustomStoryObj<typeof Icon> = {
  argTypes: {
    fill: {
      control: "color",
    },
    size: {
      control: { type: "select" },
      options: Object.values(Sizes),
    },
  },
  args: {
    fill: green.dark3,
    size: Sizes.medium,
  },
  render: (args) => (
    <div className={styles.container}>
      {Object.keys(glyphs).map((name) => (
        <div key={name} className={styles.iconContainer}>
          <Icon {...args} glyph={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
