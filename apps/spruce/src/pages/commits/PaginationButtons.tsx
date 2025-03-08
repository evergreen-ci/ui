import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { MainlineCommitQueryParams } from "types/commits";

interface PaginationButtonsProps {
  nextPageOrderNumber?: number;
  prevPageOrderNumber?: number;
}
export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  nextPageOrderNumber,
  prevPageOrderNumber,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const updateQueryParams = useUpdateURLQueryParams();

  const onNextClick = () => {
    sendEvent({ name: "Changed page", direction: "next" });
    updateQueryParams({
      [MainlineCommitQueryParams.SkipOrderNumber]:
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        nextPageOrderNumber.toString(),
    });
  };
  const onPrevClick = () => {
    sendEvent({
      name: "Changed page",
      direction: "previous",
    });
    updateQueryParams({
      [MainlineCommitQueryParams.SkipOrderNumber]:
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        prevPageOrderNumber.toString(),
    });
  };
  return (
    <Container>
      <StyledButton
        data-cy="prev-page-button"
        disabled={
          prevPageOrderNumber === null || prevPageOrderNumber === undefined
        }
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={onPrevClick}
      />
      <StyledButton
        data-cy="next-page-button"
        disabled={
          nextPageOrderNumber === null || nextPageOrderNumber === undefined
        }
        leftGlyph={<Icon glyph="ChevronRight" />}
        onClick={onNextClick}
      />
    </Container>
  );
};

const StyledButton = styled(Button)`
  margin-left: ${size.xs};
`;

const Container = styled.div`
  align-self: flex-end;
`;
