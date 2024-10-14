import { SortingState } from "@leafygreen-ui/table";
import { TableQueryParams, PaginationQueryParams } from "constants/queryParams";
import { SortDirection } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";
import { queryString } from "utils";

const { getSortString } = queryString;

interface Props {
  sendAnalyticsEvents?: (sorter: SortingState) => void;
  // TODO: DEVPROD-11539 - Remove this prop and make the default behavior to use a single query param.
  singleQueryParam?: boolean;
}

type CallbackType = (sorter: SortingState) => void;

/**
 * `useTableSort` manages sorting via query params with react-table.
 * @param props - Object containing the following:
 * @param props.sendAnalyticsEvents - Optional callback that makes a call to sendEvent.
 * @param props.singleQueryParam - Optional boolean that determines whether to use a single query param for sorting.
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
      [TableQueryParams.SortDir]: undefined,
      [TableQueryParams.SortBy]: undefined,
    };

    if (sorter.length === 1 && !props?.singleQueryParam) {
      const { desc, id } = sorter[0];
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      nextQueryParams[TableQueryParams.SortDir] = desc
        ? SortDirection.Desc
        : SortDirection.Asc;
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      nextQueryParams[TableQueryParams.SortBy] = id;
    } else if (sorter.length) {
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
