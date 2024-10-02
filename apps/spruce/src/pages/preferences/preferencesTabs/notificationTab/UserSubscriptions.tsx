import { useMemo, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Pagination from "@leafygreen-ui/pagination";
import { palette } from "@leafygreen-ui/palette";
import {
  getFacetedUniqueValues,
  getFilteredRowModel,
  filterFns,
  useLeafyGreenTable,
} from "@leafygreen-ui/table";
import Icon from "components/Icon";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { ShortenedRouterLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { getSubscriberText } from "constants/subscription";
import { size } from "constants/tokens";
import {
  resourceTypeToCopy,
  resourceTypeTreeData,
  triggerToCopy,
  triggerTreeData,
} from "constants/triggers";
import { useToastContext } from "context/toast";
import {
  DeleteSubscriptionsMutation,
  DeleteSubscriptionsMutationVariables,
  GeneralSubscription,
  Selector,
} from "gql/generated/types";
import { DELETE_SUBSCRIPTIONS } from "gql/mutations";
import { useSpruceConfig } from "hooks";
import {
  NotificationMethods,
  notificationMethodToCopy,
} from "types/subscription";
import { jiraLinkify } from "utils/string";
import { ClearSubscriptions } from "./ClearSubscriptions";
import { useSubscriptionData } from "./useSubscriptionData";
import { getResourceRoute } from "./utils";

const { gray } = palette;

export const UserSubscriptions: React.FC<{}> = () => {
  const subscriptions = useSubscriptionData();
  return (
    <>
      <SettingsCardTitle>Manage subscriptions</SettingsCardTitle>
      <SettingsCard>
        {!subscriptions?.length ? (
          "No subscriptions found."
        ) : (
          <SubscriptionsTable subscriptions={subscriptions} />
        )}
      </SettingsCard>
    </>
  );
};

const SubscriptionsTable: React.FC<{
  subscriptions: GeneralSubscription[];
}> = ({ subscriptions }) => {
  const dispatchToast = useToastContext();
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  const [deleteSubscriptions] = useMutation<
    DeleteSubscriptionsMutation,
    DeleteSubscriptionsMutationVariables
  >(DELETE_SUBSCRIPTIONS, {
    refetchQueries: ["UserSubscriptions"],
    onCompleted: (result) => {
      dispatchToast.success(
        `Deleted ${result.deleteSubscriptions} subscription${
          result.deleteSubscriptions === 1 ? "" : "s"
        }.`,
      );
    },
    onError: (e) => {
      dispatchToast.error(
        `Error attempting to delete subscriptions: ${e.message}`,
      );
    },
  });
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: "resourceType",
        id: "resourceType",
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        cell: ({ getValue }) => {
          const resourceType = getValue();
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          return resourceTypeToCopy[resourceType] ?? resourceType;
        },
        enableColumnFilter: true,
        filterFn: filterFns.arrIncludesSome,
        header: "Type",
        meta: {
          treeSelect: {
            "data-cy": "status-filter-popover",
            filterOptions: true,
            options: resourceTypeTreeData,
          },
        },
      },
      {
        header: "ID",
        accessorKey: "selectors",
        cell: ({
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          getValue,
          row: {
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            original: { resourceType },
          },
        }) => {
          const selectors = getValue();
          const resourceSelector = selectors.find(
            (s: Selector) => s.type !== "object" && s.type !== "requester",
          );
          const { data: selectorId } = resourceSelector ?? {};
          const route = getResourceRoute(resourceType, resourceSelector);

          return route ? (
            <ShortenedRouterLink to={route}>{selectorId}</ShortenedRouterLink>
          ) : (
            selectorId
          );
        },
      },
      {
        accessorKey: "trigger",
        header: "Event",
        enableColumnFilter: true,
        filterFn: filterFns.arrIncludesSome,
        meta: {
          treeSelect: {
            "data-cy": "trigger-filter-popover",
            filterOptions: true,
            options: triggerTreeData,
          },
        },
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        cell: ({ getValue }) => {
          const trigger = getValue();
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          return triggerToCopy[trigger] ?? trigger;
        },
      },
      {
        header: "Notify by",
        accessorKey: "subscriber.type",
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        cell: ({ getValue }) => {
          const subscriberType = getValue();
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          return notificationMethodToCopy[subscriberType] ?? subscriberType;
        },
      },
      {
        header: "Target",
        accessorKey: "subscriber",
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        cell: ({ getValue }) => {
          const subscriber = getValue();
          const text = getSubscriberText(subscriber);
          return subscriber.type === NotificationMethods.JIRA_COMMENT
            ? // @ts-expect-error: FIXME. This comment was added by an automated script.
              jiraLinkify(text, jiraHost)
            : text;
        },
      },
    ],
    [jiraHost],
  );

  const table = useLeafyGreenTable<GeneralSubscription>({
    columns,
    containerRef: tableContainerRef,
    data: subscriptions ?? [],
    defaultColumn: {
      enableColumnFilter: false,
    },
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    hasSelectableRows: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
    withPagination: true,
  });

  const onDeleteSubscriptions = () => {
    const subscriptionIds = table
      .getSelectedRowModel()
      .rows.map(({ original }) => original.id);

    deleteSubscriptions({ variables: { subscriptionIds } });

    table.resetRowSelection();
  };

  return (
    <>
      <InteractiveWrapper>
        <Button
          data-cy="delete-some-button"
          disabled={Object.entries(rowSelection).length === 0}
          leftGlyph={<Icon glyph="Trash" />}
          onClick={onDeleteSubscriptions}
          size="small"
        >
          Delete
          {Object.entries(rowSelection).length
            ? ` (${Object.entries(rowSelection).length})`
            : ""}
        </Button>
        <PaginationWrapper>
          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            itemsPerPage={table.getState().pagination.pageSize}
            numTotalItems={subscriptions.length}
            onBackArrowClick={() => table.previousPage()}
            onCurrentPageOptionChange={(value: string) => {
              table.setPageIndex(Number(value) - 1);
            }}
            onForwardArrowClick={() => table.nextPage()}
            onItemsPerPageOptionChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
          />
        </PaginationWrapper>
      </InteractiveWrapper>
      <BaseTable
        data-cy-row="subscription-row"
        shouldAlternateRowColor
        table={table}
      />
      <TableFooter>
        <ClearSubscriptions />
      </TableFooter>
    </>
  );
};

const InteractiveWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.s};
`;

const PaginationWrapper = styled.div`
  width: 50%;
`;

const TableFooter = styled.div`
  box-shadow: 0 -4px ${gray.light2};
  display: flex;
  justify-content: flex-end;
  margin-top: ${size.s};
  padding-top: ${size.s};
`;
