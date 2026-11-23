import { Body } from "@via-ds/components/typography";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SettingsCard, SettingsCardTitle } from "./SettingsCard";

export default {
  component: SettingsCard,
} satisfies CustomMeta<typeof SettingsCard>;

export const Default: CustomStoryObj<typeof SettingsCard> = {
  args: {
    children: <Body>Settings card content goes here.</Body>,
  },
  render: (args) => (
    <>
      <SettingsCardTitle>Card title</SettingsCardTitle>
      <SettingsCard {...args} />
    </>
  ),
};
