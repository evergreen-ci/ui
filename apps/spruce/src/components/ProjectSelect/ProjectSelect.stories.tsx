import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { getWaterfallRoute } from "constants/routes";
import { PROJECTS } from "gql/queries";
import { mocks } from "./testData";
import { ProjectSelect } from ".";

export default {
  component: ProjectSelect,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
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

const loadingMocks = [{ request: { query: PROJECTS }, delay: Infinity }];

export const Loading: CustomStoryObj<typeof ProjectSelect> = {
  parameters: {
    apolloClient: {
      mocks: loadingMocks,
    },
  },
  render: () => (
    <ProjectSelect
      getProjectRoute={getWaterfallRoute}
      selectedProjectIdentifier="evergreen"
    />
  ),
};

export const LoadingWithoutLabel: CustomStoryObj<typeof ProjectSelect> = {
  parameters: {
    apolloClient: {
      mocks: loadingMocks,
    },
  },
  render: () => (
    <ProjectSelect
      getProjectRoute={getWaterfallRoute}
      selectedProjectIdentifier="evergreen"
      showLabel={false}
    />
  ),
};
