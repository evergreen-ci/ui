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
  parameters: {
    // GuideCue opens its popover on a 400ms timeout + JS fade; don't shrink.
    chromatic: { delay: 1500 },
  },
  render: (args) => {
    // A prior dismissal persists a 365-day cookie that hides the tooltip.
    Cookies.remove(cookieName);
    return (
      // The anchor div is display: block; without a flex parent (as in app
      // usage) it spans full width and the popover centers on the page.
      <div style={{ display: "flex" }}>
        <ExpiringAnnouncementTooltip {...args} />
      </div>
    );
  },
};
