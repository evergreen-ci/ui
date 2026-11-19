import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { SiteBanner } from "./SiteBanner";
import styles from "./SiteBanner.stories.module.css";

const themes = ["announcement", "information", "warning", "important"];

export default {
  component: SiteBanner,
  parameters: {
    apolloClient: { mocks: [getSpruceConfigMock] },
  },
} satisfies CustomMeta<typeof SiteBanner>;

export const Default: CustomStoryObj<typeof SiteBanner> = {
  argTypes: {
    theme: {
      control: "select",
      options: themes,
    },
  },
  args: {
    text: "Evergreen will be down for maintenance Saturday. Follow DEVPROD-1234 for updates.",
    theme: "information",
  },
  render: (args) => <SiteBanner key={args.text} {...args} />,
};

export const AllThemes: CustomStoryObj<typeof SiteBanner> = {
  render: () => (
    <div className={styles.container}>
      {themes.map((theme) => (
        <SiteBanner
          key={theme}
          text={`Site banner with the ${theme} theme.`}
          theme={theme}
        />
      ))}
    </div>
  ),
};
