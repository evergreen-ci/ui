import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { useHostsTableAnalytics } from "analytics";
import { UpdateStatusModal } from "components/Hosts";
import { Reprovision } from "components/Hosts/Reprovision";
import { RestartJasper } from "components/Hosts/RestartJasper";
import PageSizeSelector from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import {
  TableControlOuterRow,
  TableControlInnerRow,
  PageWrapper,
} from "components/styles";
import { size } from "constants/tokens";
import { HostsQuery, HostsQueryVariables } from "gql/generated/types";
import { HOSTS } from "gql/queries";
import { usePageTitle } from "hooks";
import usePagination from "hooks/usePagination";
import { HostsTable } from "pages/hosts/HostsTable";
import { getFilters, useQueryVariables, getSorting } from "./utils";

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

  const hasFilters =
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    hostId || currentTaskId || distroId || statuses.length || startedBy;

  const [selectedHosts, setSelectedHosts] = useState([]);

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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const errorHosts = [];
    selectedHosts.forEach((host) => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      const bootstrapMethod = host?.distro?.bootstrapMethod;
      if (
        !(
          (bootstrapMethod === "ssh" || bootstrapMethod === "user-data") &&
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          host?.status === "running"
        )
      ) {
        canRestart = false;
        canRepro = false;
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        errorHosts.push(` ${host?.id}`);
      }
    });
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    restartJasperErrorMessage += ` ${errorHosts}`;
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
            <Badge variant={Variant.Blue} data-cy="hosts-selection-badge">
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
                selectedHostIds={selectedHostIds}
                canRestartJasper={canRestartJasper}
                jasperTooltipMessage={restartJasperError}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <Reprovision
                selectedHostIds={selectedHostIds}
                canReprovision={canReprovision}
                reprovisionTooltipMessage={reprovisionError}
              />
            </ButtonWrapper>
          </HostsSelectionWrapper>
        </SubtitleDataWrapper>
        <TableControlInnerRow>
          <Pagination
            data-cy="hosts-table-pagination"
            currentPage={page}
            totalResults={hasFilters ? filteredHostCount : totalHostsCount}
            pageSize={limit}
          />
          <PageSizeSelector
            data-cy="hosts-table-page-size-selector"
            value={limit}
            onChange={handlePageSizeChange}
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <HostsTable
        initialFilters={initialFilters}
        initialSorting={initialSorting}
        hosts={hostItems}
        loading={loading && hostItems.length === 0}
        limit={limit}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        setSelectedHosts={setSelectedHosts}
      />
      <UpdateStatusModal
        data-cy="update-host-status-modal"
        hostIds={selectedHostIds}
        visible={isUpdateStatusModalVisible}
        closeModal={() => setIsUpdateStatusModalVisible(false)}
        isHostPage={false}
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
