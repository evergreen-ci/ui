import { useEffect } from "react";
import styled from "@emotion/styled";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { QueryParams } from "constants/queryParams";
import { useQueryParams } from "hooks/useQueryParam";
import BookmarksBar from ".";

export default {
  component: BookmarksBar,
} satisfies CustomMeta<typeof BookmarksBar>;

const Story = ({ ...args }: React.ComponentProps<typeof BookmarksBar>) => {
  const [, setSearchParams] = useQueryParams();

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
