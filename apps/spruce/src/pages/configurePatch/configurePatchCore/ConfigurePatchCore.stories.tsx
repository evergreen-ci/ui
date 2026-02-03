import {
  WithToastContext,
  CustomStoryObj,
  CustomMeta,
} from "@evg-ui/lib/test_utils";
import { patchQuery, mocks } from "./testData";
import ConfigurePatchCore from ".";

export default {
  component: ConfigurePatchCore,
  title: "pages/configurePatch/configurePatchCore",
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
  parameters: {
    apolloClient: {
      mocks,
    },
    reactRouter: {
      initialEntries: [`/patch/${patchQuery.patch.id}/configure`],
      path: "/patch/:patchId/configure/*",
      route: `/patch/${patchQuery.patch.id}/configure/tasks`,
    },
    storyshots: { disable: true }, // FIXME: This story is disabled because the @leafygreen-ui/tabs@13.1.1 package is generating inconsistent snapshots
  },
} satisfies CustomMeta<typeof ConfigurePatchCore>;

export const ConfigureTasksDefault: CustomStoryObj<typeof ConfigurePatchCore> =
  {
    render: (args) => <ConfigurePatchCore {...args} />,
    args: {
      patch: patchQuery.patch,
    },
  };
