import { Badge } from "@leafygreen-ui/badge";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import PageTitle from ".";

export default {
  component: PageTitle,
} satisfies CustomMeta<typeof PageTitle>;

export const Default: CustomStoryObj<typeof PageTitle> = {
  args: {
    badge: <Badge>Some Badge</Badge>,
    loading: false,
    size: "large",
    title: "Test Page",
  },
  argTypes: {},
  render: (args) => <PageTitle {...args} />,
};

export const WithBadge: CustomStoryObj<typeof PageTitle> = {
  args: {
    badge: <Badge>Some Badge</Badge>,
    loading: false,
    title: "Test Page",
  },
  argTypes: {},
  render: (args) => <PageTitle {...args} />,
};

export const WithSubtitle: CustomStoryObj<typeof PageTitle> = {
  args: {
    loading: false,
    subtitle: <>Some subtitle</>,
    title: "Test Page",
  },
  argTypes: {},
  render: (args) => <PageTitle {...args} />,
};
