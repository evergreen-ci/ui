import { SortingState } from "@leafygreen-ui/table";
import { PaginationQueryParams } from "@evg-ui/lib/constants";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { TableQueryParams } from "constants/queryParams";
import { SortDirection } from "gql/generated/types";
import { getSortString } from "utils/queryString";

interface Props {
  sendAnalyticsEvents?: (sorter: SortingState) => void;
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

  const tableChangeHandler = ((sorter: SortingState) => {
    props?.sendAnalyticsEvents?.(sorter);

    const nextQueryParams = {
      ...queryParams,
      [PaginationQueryParams.Page]: "0",
      [TableQueryParams.Sorts]: undefined,
    };

    if (sorter.length) {
      const sortString = sorter
        .map(({ desc, id }) =>
          getSortString(id, desc ? SortDirection.Desc : SortDirection.Asc),
        )
        .filter(Boolean)
        .join(";");

      // @ts-expect-error: FIXME. This comment was added by an automated script.
      nextQueryParams[TableQueryParams.Sorts] = sortString;
    }
    setQueryParams(nextQueryParams);
  }) satisfies CallbackType;

  return tableChangeHandler;
};
