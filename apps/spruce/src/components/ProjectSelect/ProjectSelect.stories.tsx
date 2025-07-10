import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { getWaterfallRoute } from "constants/routes";
import { mocks } from "./testData";
import { ProjectSelect } from ".";

export default {
  component: ProjectSelect,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
  parameters: {
    apolloClient: {
      mocks,
    },
  },
} satisfies CustomMeta<typeof ProjectSelect>;

export const Default: CustomStoryObj<typeof ProjectSelect> = {
  render: () => (
    <ProjectSelect
      getProjectRoute={getWaterfallRoute}
      selectedProjectIdentifier="evergreen"
    />
  ),
};

export const WithClickableHeader: CustomStoryObj<typeof ProjectSelect> = {
  render: () => (
    <ProjectSelect
      getProjectRoute={getWaterfallRoute}
      isProjectSettingsPage
      selectedProjectIdentifier="evergreen"
    />
  ),
};
