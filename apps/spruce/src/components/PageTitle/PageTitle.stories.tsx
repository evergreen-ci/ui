import { Badge } from "@leafygreen-ui/badge";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import PageTitle from ".";

export default {
  component: PageTitle,
} satisfies CustomMeta<typeof PageTitle>;

export const Default: CustomStoryObj<typeof PageTitle> = {
  render: (args) => <PageTitle {...args} />,
  argTypes: {},
  args: {
    loading: false,
    title: "Test Page",
    size: "large",
    badge: <Badge>Some Badge</Badge>,
  },
};

export const WithBadge: CustomStoryObj<typeof PageTitle> = {
  render: (args) => <PageTitle {...args} />,
  argTypes: {},
  args: {
    loading: false,
    title: "Test Page",
    badge: <Badge>Some Badge</Badge>,
  },
};

export const WithSubtitle: CustomStoryObj<typeof PageTitle> = {
  render: (args) => <PageTitle {...args} />,
  argTypes: {},
  args: {
    loading: false,
    title: "Test Page",
    subtitle: <>Some subtitle</>,
  },
};
