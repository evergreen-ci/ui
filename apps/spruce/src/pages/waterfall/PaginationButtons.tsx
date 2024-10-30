import { FetchMoreFunction } from "@apollo/client/react/hooks/useSuspenseQuery";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useWaterfallAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import {
  Exact,
  WaterfallOptions,
  WaterfallPagination,
  WaterfallQuery,
} from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";

interface PaginationButtonsProps {
  fetchMore: FetchMoreFunction<
    WaterfallQuery,
    Exact<{
      options: WaterfallOptions;
    }>
  >;
  pagination: WaterfallPagination;
  projectIdentifier: string;
}
export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  fetchMore,
  pagination,
  projectIdentifier,
}) => {
  const { hasNextPage, hasPrevPage, nextPageOrder, prevPageOrder } = pagination;
  const { sendEvent } = useWaterfallAnalytics();
  const [queryParams, setQueryParams] = useQueryParams();

  const onNextClick = () => {
    sendEvent({ name: "Changed page", direction: "next" });
    fetchMore({
      variables: {
        options: {
          projectIdentifier,
          maxOrder: nextPageOrder,
        },
      },
    });
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.MaxOrder]: nextPageOrder,
      [WaterfallFilterOptions.MinOrder]: undefined,
    });
  };

  const onPrevClick = () => {
    sendEvent({
      name: "Changed page",
      direction: "previous",
    });
    fetchMore({
      variables: {
        options: {
          projectIdentifier,
          minOrder: prevPageOrder,
        },
      },
    });
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.MaxOrder]: undefined,
      [WaterfallFilterOptions.MinOrder]: prevPageOrder,
    });
  };

  return (
    <Container>
      <Button
        data-cy="prev-page-button"
        disabled={!hasPrevPage}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={onPrevClick}
      />
      <Button
        data-cy="next-page-button"
        disabled={!hasNextPage}
        leftGlyph={<Icon glyph="ChevronRight" />}
        onClick={onNextClick}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: ${size.xs};
  align-self: flex-end;
`;
