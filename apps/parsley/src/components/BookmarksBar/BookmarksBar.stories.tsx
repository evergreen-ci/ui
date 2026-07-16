import { useEffect } from "react";
import styled from "@emotion/styled";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import BookmarksBar from ".";

export default {
  component: BookmarksBar,
} satisfies CustomMeta<typeof BookmarksBar>;

const Story = ({ ...args }: React.ComponentProps<typeof BookmarksBar>) => {
  const [, setSearchParams] = useQueryParams(urlParseOptions);

  useEffect(() => {
    setSearchParams({
      [QueryParams.Bookmarks]: [4, 5, 6, 7, 21, 24, 30, 85],
      [QueryParams.ShareLine]: 21,
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
  args: {
    failingLine: 10,
    lineCount: 100,
  },
  argTypes: {
    scrollToLine: { action: "scrollToLine" },
  },
  render: (args) => <Story {...args} />,
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 600px;
`;
