import { palette } from "@leafygreen-ui/palette";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import styles from "./Icon.stories.module.css";
import Icon, { glyphs, sizeMap } from ".";

const { green } = palette;

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
      options: Object.values(sizeMap),
    },
  },
  args: {
    fill: green.dark3,
    size: sizeMap.medium,
  },
  render: (args) => (
    <div className={styles.container}>
      {(Object.keys(glyphs) as Array<keyof typeof glyphs>).map((name) => (
        <div key={name} className={styles.iconContainer}>
          <Icon {...args} glyph={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
