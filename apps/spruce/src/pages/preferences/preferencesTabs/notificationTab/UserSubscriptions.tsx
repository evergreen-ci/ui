import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { Pagination } from "@leafygreen-ui/pagination";
import { palette } from "@leafygreen-ui/palette";
import {
  Icon,
  getFacetedUniqueValues,
  getFilteredRowModel,
  filterFns,
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useToastContext } from "@evg-ui/lib/context";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { ShortenedRouterLink } from "components/styles";
import { getSubscriberText } from "constants/subscription";
import {
  resourceTypeToCopy,
  resourceTypeTreeData,
  triggerToCopy,
  triggerTreeData,
} from "constants/triggers";
import {
  DeleteSubscriptionsMutation,
  DeleteSubscriptionsMutationVariables,
  GeneralSubscription,
  Selector,
  SubscriberWrapper,
} from "gql/generated/types";
import { DELETE_SUBSCRIPTIONS } from "gql/mutations";
import { useSpruceConfig } from "hooks";
import {
  NotificationMethods,
  notificationMethodToCopy,
} from "types/subscription";
import { ResourceType } from "types/triggers";
import { jiraLinkify } from "utils/string";
import { ClearSubscriptions } from "./ClearSubscriptions";
import { useSubscriptionData } from "./useSubscriptionData";
import { getResourceRoute } from "./utils";

const { gray } = palette;

export const UserSubscriptions: React.FC = () => {
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

  const columns = useMemo(() => getColumns(jiraHost ?? ""), [jiraHost]);

  const table = useLeafyGreenTable<GeneralSubscription>({
    columns,
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

const getColumns = (jiraHost: string): LGColumnDef<GeneralSubscription>[] => [
  {
    accessorKey: "resourceType",
    id: "resourceType",
    cell: ({ getValue }) => {
      const resourceType = getValue() as ResourceType;
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
      getValue,
      row: {
        original: { resourceType },
      },
    }) => {
      const selectors = getValue() as Selector[];
      const resourceSelector = selectors.find(
        (s) => s.type !== "object" && s.type !== "requester",
      );
      const { data: selectorId } = resourceSelector ?? {};
      const route = getResourceRoute(
        resourceType as ResourceType,
        resourceSelector,
      );

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
    cell: ({ getValue }) => {
      const trigger = getValue() as keyof typeof triggerToCopy;
      return triggerToCopy[trigger] ?? trigger;
    },
  },
  {
    header: "Notify by",
    accessorKey: "subscriber.type",
    cell: ({ getValue }) => {
      const subscriberType =
        getValue() as keyof typeof notificationMethodToCopy;
      return notificationMethodToCopy[subscriberType] ?? subscriberType;
    },
  },
  {
    header: "Target",
    accessorKey: "subscriber",
    cell: ({ getValue }) => {
      const subscriber = getValue() as SubscriberWrapper;
      const text = getSubscriberText(subscriber) ?? "";
      return subscriber.type === NotificationMethods.JIRA_COMMENT
        ? jiraLinkify(text, jiraHost)
        : text;
    },
  },
];

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
