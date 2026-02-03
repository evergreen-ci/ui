import { useEffect } from "react";
import styled from "@emotion/styled";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import BookmarksBar from ".";

export default {
  component: BookmarksBar,
} satisfies CustomMeta<typeof BookmarksBar>;

const Story = ({ ...args }: React.ComponentProps<typeof BookmarksBar>) => {
  const [, setSearchParams] = useQueryParams(urlParseOptions);

  useEffect(() => {
    setSearchParams({
      [QueryParams.ShareLine]: 21,
      [QueryParams.Bookmarks]: [4, 5, 6, 7, 21, 24, 30, 85],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <BookmarksBar {...args} />
    </Container>
  );
};
export const Default: CustomStoryObj<typeof BookmarksBar> = {
  argTypes: {
    scrollToLine: { action: "scrollToLine" },
  },
  args: {
    failingLine: 10,
    lineCount: 100,
  },
  render: (args) => <Story {...args} />,
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 600px;
`;
