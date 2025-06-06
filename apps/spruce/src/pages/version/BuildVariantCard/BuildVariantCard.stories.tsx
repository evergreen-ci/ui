import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
  versionMock,
} from "gql/mocks/getSpruceConfig";
import { mocks } from "./testData";
import BuildVariantCard from ".";

export default {
  title: "Pages/Version/BuildVariantCard",
  component: BuildVariantCard,
  parameters: {
    apolloClient: {
      mocks: [...mocks, getSpruceConfigMock, getUserSettingsMock, versionMock],
    },
  },
} satisfies CustomMeta<typeof BuildVariantCard>;

export const Default: CustomStoryObj<typeof BuildVariantCard> = {
  render: (args) => <BuildVariantCard {...args} />,
  args: {
    versionId: "version",
  },
};
