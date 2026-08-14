import Cookies from "js-cookie";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { ExpiringAnnouncementTooltip } from ".";

const cookieName = "STORYBOOK_ANNOUNCEMENT_TOOLTIP";

export default {
  component: ExpiringAnnouncementTooltip,
} satisfies CustomMeta<typeof ExpiringAnnouncementTooltip>;

export const Default: CustomStoryObj<typeof ExpiringAnnouncementTooltip> = {
  args: {
    children: "Try out this feature",
    cookieName,
    title: "New Release",
  },
  render: (args) => {
    // Dismissing the tooltip persists a cookie; clear it so the story always
    // shows the first-view (open) state.
    Cookies.remove(cookieName);
    return <ExpiringAnnouncementTooltip {...args} />;
  },
};
