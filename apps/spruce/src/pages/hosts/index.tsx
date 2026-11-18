import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Badge,
  BadgeVariant,
  Button,
  Disclaimer,
  H2,
} from "@via-ds/components";
import { Pagination } from "@evg-ui/lib/components/Pagination";
import {
  TableControlInnerRow,
  TableControlOuterRow,
} from "@evg-ui/lib/components/Table/TableControl/styles";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import usePagination from "@evg-ui/lib/src/hooks/usePagination";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useHostsTableAnalytics } from "analytics";
import { UpdateStatusModal } from "components/Hosts";
import { Reprovision } from "components/Hosts/Reprovision";
import { RestartJasper } from "components/Hosts/RestartJasper";
import { PageWrapper } from "components/styles";
import { HostsQuery, HostsQueryVariables } from "gql/generated/types";
import { HOSTS } from "gql/queries";
import { HostsTable } from "pages/hosts/HostsTable";
import styles from "./index.module.css";
import { getFilters, getSorting, useQueryVariables } from "./utils";

type Host = Unpacked<HostsQuery["hosts"]["hosts"]>;

const Hosts: React.FC = () => {
  const { sendEvent } = useHostsTableAnalytics();
  usePageTitle("Hosts");
  const queryVariables = useQueryVariables();
  const { currentTaskId, distroId, hostId, startedBy, statuses } =
    queryVariables;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFilters = useMemo(() => getFilters(queryVariables), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialSorting = useMemo(() => getSorting(queryVariables), []);

  const hasFilters = Boolean(
    hostId || currentTaskId || distroId || statuses?.length || startedBy,
  );

  const [selectedHosts, setSelectedHosts] = useState<Host[]>([]);

  const {
    canReprovision,
    canRestartJasper,
    reprovisionError,
    restartJasperError,
    selectedHostIds,
  } = useMemo(() => {
    let canRestart = true;
    let canRepro = true;

    let restartJasperErrorMessage = "Jasper cannot be restarted for:";
    let reprovisionErrorMessage =
      "The following hosts cannot be reprovisioned:";
    const errorHosts: string[] = [];
    selectedHosts.forEach((host: Host) => {
      const bootstrapMethod = host?.distro?.bootstrapMethod;
      if (
        !(
          (bootstrapMethod === "ssh" || bootstrapMethod === "user-data") &&
          host?.status === "running"
        )
      ) {
        canRestart = false;
        canRepro = false;
        errorHosts.push(` ${host?.id}`);
      }
    });
    restartJasperErrorMessage += ` ${errorHosts}`;
    reprovisionErrorMessage += ` ${errorHosts}`;

    const hostIds = selectedHosts.map(({ id }) => id);

    return {
      canReprovision: canRepro,
      canRestartJasper: canRestart,
      reprovisionError: reprovisionErrorMessage,
      restartJasperError: restartJasperErrorMessage,
      selectedHostIds: hostIds,
    };
  }, [selectedHosts]);

  // UPDATE STATUS MODAL VISIBILITY STATE
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
    useState<boolean>(false);

  // HOSTS QUERY
  const { data: hostsData, loading } = useQuery<
    HostsQuery,
    HostsQueryVariables
  >(HOSTS, {
    variables: queryVariables,
    fetchPolicy: "cache-and-network",
  });

  const hosts = hostsData?.hosts;
  const hostItems = hosts?.hosts ?? [];
  const totalHostsCount = hosts?.totalHostsCount ?? 0;
  const filteredHostCount = hosts?.filteredHostsCount ?? 0;

  const { limit, page } = usePagination();
  return (
    <PageWrapper data-testid="hosts-page">
      <H2>Evergreen Hosts</H2>
      <TableControlOuterRow>
        <div className={styles.subtitleDataWrapper}>
          <Disclaimer data-testid="filtered-hosts-count">
            {`Showing ${
              hasFilters ? filteredHostCount : totalHostsCount
            } of ${totalHostsCount}`}
          </Disclaimer>
          <div className={styles.hostsSelectionWrapper}>
            <Badge
              data-testid="hosts-selection-badge"
              variant={BadgeVariant.Info}
            >
              {selectedHostIds.length} Selected
            </Badge>
            <div className={styles.buttonWrapper}>
              <Button
                data-testid="update-status-button"
                isDisabled={selectedHostIds.length === 0}
                onPress={() => setIsUpdateStatusModalVisible(true)}
              >
                Update Status
              </Button>
            </div>
            <div className={styles.buttonWrapper}>
              <RestartJasper
                canRestartJasper={canRestartJasper}
                jasperTooltipMessage={restartJasperError}
                selectedHostIds={selectedHostIds}
              />
            </div>
            <div className={styles.buttonWrapper}>
              <Reprovision
                canReprovision={canReprovision}
                reprovisionTooltipMessage={reprovisionError}
                selectedHostIds={selectedHostIds}
              />
            </div>
          </div>
        </div>
        <TableControlInnerRow>
          <Pagination
            currentPage={page}
            data-testid="hosts-table-pagination"
            loading={loading}
            onPageChange={(newPage) =>
              sendEvent({
                name: "Changed page",
                "page.number": newPage,
              })
            }
            onPageSizeChange={(newPageSize) =>
              sendEvent({
                name: "Changed page size",
                "page.size": newPageSize,
              })
            }
            pageSize={limit}
            totalResults={hasFilters ? filteredHostCount : totalHostsCount}
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <HostsTable
        hosts={hostItems}
        initialFilters={initialFilters}
        initialSorting={initialSorting}
        limit={limit}
        loading={loading && hostItems.length === 0}
        setSelectedHosts={setSelectedHosts}
      />
      <UpdateStatusModal
        closeModal={() => setIsUpdateStatusModalVisible(false)}
        data-testid="update-host-status-modal"
        hostIds={selectedHostIds}
        isHostPage={false}
        visible={isUpdateStatusModalVisible}
      />
    </PageWrapper>
  );
};

export default Hosts;
