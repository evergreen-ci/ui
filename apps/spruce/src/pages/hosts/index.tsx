import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { Button } from "@leafygreen-ui/button";
import { Disclaimer, H2 } from "@leafygreen-ui/typography";
import PageSizeSelector from "@evg-ui/lib/components/PageSizeSelector";
import Pagination from "@evg-ui/lib/components/Pagination";
import {
  TableControlOuterRow,
  TableControlInnerRow,
} from "@evg-ui/lib/components/Table/TableControl/styles";
import { size } from "@evg-ui/lib/constants/tokens";
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
import { getFilters, getSorting, useQueryVariables } from "./utils";

type Host = Unpacked<HostsQuery["hosts"]["hosts"]>;

const Hosts: React.FC = () => {
  const hostsTableAnalytics = useHostsTableAnalytics();
  usePageTitle("Hosts");
  const { setLimit } = usePagination();
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

  const handlePageSizeChange = (pageSize: number): void => {
    setLimit(pageSize);
    hostsTableAnalytics.sendEvent({
      name: "Changed page size",
      "page.size": pageSize,
    });
  };

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
    <PageWrapper data-cy="hosts-page">
      <H2>Evergreen Hosts</H2>
      <TableControlOuterRow>
        <SubtitleDataWrapper>
          <Disclaimer data-cy="filtered-hosts-count">
            {`Showing ${
              hasFilters ? filteredHostCount : totalHostsCount
            } of ${totalHostsCount}`}
          </Disclaimer>
          <HostsSelectionWrapper>
            <Badge data-cy="hosts-selection-badge" variant={Variant.Blue}>
              {selectedHostIds.length} Selected
            </Badge>
            <ButtonWrapper>
              <Button
                data-cy="update-status-button"
                disabled={selectedHostIds.length === 0}
                onClick={() => setIsUpdateStatusModalVisible(true)}
              >
                Update Status
              </Button>
            </ButtonWrapper>
            <ButtonWrapper>
              <RestartJasper
                canRestartJasper={canRestartJasper}
                jasperTooltipMessage={restartJasperError}
                selectedHostIds={selectedHostIds}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <Reprovision
                canReprovision={canReprovision}
                reprovisionTooltipMessage={reprovisionError}
                selectedHostIds={selectedHostIds}
              />
            </ButtonWrapper>
          </HostsSelectionWrapper>
        </SubtitleDataWrapper>
        <TableControlInnerRow>
          <Pagination
            currentPage={page}
            data-cy="hosts-table-pagination"
            pageSize={limit}
            totalResults={hasFilters ? filteredHostCount : totalHostsCount}
          />
          <PageSizeSelector
            data-cy="hosts-table-page-size-selector"
            onChange={handlePageSizeChange}
            value={limit}
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
        data-cy="update-host-status-modal"
        hostIds={selectedHostIds}
        isHostPage={false}
        visible={isUpdateStatusModalVisible}
      />
    </PageWrapper>
  );
};

const SubtitleDataWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 70px;
`;
const HostsSelectionWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: ${size.l};
`;
const ButtonWrapper = styled.div`
  margin-left: ${size.m};
`;

export default Hosts;
