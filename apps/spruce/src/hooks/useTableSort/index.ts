import { SortingState } from "@leafygreen-ui/table";
import { TableQueryParams, PaginationQueryParams } from "constants/queryParams";
import { SortDirection } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";
import { toSortString } from "utils/queryString";

interface Props {
  sendAnalyticsEvents?: (sorter?: SortingState) => void;
}

type CallbackType = (sorter: SortingState) => void;

/**
 * `useTableSort` manages sorting via query params with react-table.
 * @param props - Object containing the following:
 * @param props.sendAnalyticsEvents - Optional callback that makes a call to sendEvent.
 * @returns tableChangeHandler - Function that accepts react-table's sort state and updates query params with these values.
 */
export const useTableSort = (props?: Props): CallbackType => {
  const [queryParams, setQueryParams] = useQueryParams();

  const tableChangeHandler = (sorter: SortingState) => {
    props?.sendAnalyticsEvents?.(sorter);

    const nextQueryParams = {
      ...queryParams,
      [PaginationQueryParams.Page]: "0",
      [TableQueryParams.Sorts]: undefined,
    };

    if (sorter.length) {
      const sortArray = sorter.map(({ desc, id }) => ({
        id,
        direction: desc ? SortDirection.Desc : SortDirection.Asc,
      }));

      nextQueryParams[TableQueryParams.Sorts] = toSortString(sortArray, "id");
    }
    setQueryParams(nextQueryParams);
  };
  return tableChangeHandler;
};
