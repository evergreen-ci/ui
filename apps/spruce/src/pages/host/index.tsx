import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Code } from "@leafygreen-ui/code";
import { useParams } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { ALL_VALUE } from "@evg-ui/lib/components/TreeSelect";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParam } from "@evg-ui/lib/hooks";
import usePagination from "@evg-ui/lib/src/hooks/usePagination";
import { UpdateStatusModal } from "components/Hosts";
import { Reprovision } from "components/Hosts/Reprovision";
import { RestartJasper } from "components/Hosts/RestartJasper";
import HostStatusBadge from "components/HostStatusBadge";
import PageTitle from "components/PageTitle";
import {
  PageWrapper,
  PageSider,
  PageLayout,
  PageContent,
} from "components/styles";
import { slugs } from "constants/routes";
import {
  HostQuery,
  HostQueryVariables,
  HostEventsQuery,
  HostEventsQueryVariables,
  HostEventType,
} from "gql/generated/types";
import { HOST, HOST_EVENTS } from "gql/queries/index";
import { HostStatus } from "types/host";
import { HostQueryParams } from "./constants";
import HostTable from "./HostTable";
import { Metadata } from "./Metadata";

const Host: React.FC = () => {
  const dispatchToast = useToastContext();
  const { [slugs.hostId]: hostId } = useParams();

  usePageVisibilityAnalytics({
    attributes: { hostId: hostId ?? "" },
  });

  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
    useState<boolean>(false);
  const { limit, page } = usePagination();
  const [eventTypes] = useQueryParam<HostEventType[]>(
    HostQueryParams.EventType,
    [],
  );

  const {
    data: hostData,
    error,
    loading: hostMetadataLoading,
  } = useQuery<HostQuery, HostQueryVariables>(HOST, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: hostId },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the host: ${err.message}`,
      );
    },
  });

  const { data: hostEventData, loading: hostEventLoading } = useQuery<
    HostEventsQuery,
    HostEventsQueryVariables
  >(HOST_EVENTS, {
    variables: {
      id: hostId ?? "",
      opts: {
        page,
        limit,
        eventTypes: eventTypes.filter((e) => e.toString() !== ALL_VALUE),
      },
    },
    skip: !hostId,
  });

  const host = hostData?.host;
  const { distro, hostUrl, persistentDnsName, user } = host || {};
  const bootstrapMethod = distro?.bootstrapMethod;
  const status = host?.status as HostStatus;

  const sshAddress = persistentDnsName || hostUrl;
  const sshCommand = `ssh ${user}@${sshAddress}`;

  const canRestartJasperOrReprovision =
    status === "running" &&
    (bootstrapMethod === "ssh" || bootstrapMethod === "user-data");

  const hostEvents = hostEventData?.host?.events;
  const hostEventLogEntries =
    hostEventData?.host?.events?.eventLogEntries ?? [];
  const hostEventCount = hostEvents?.count ?? 0;
  const hostEventTypes = hostEventData?.host?.eventTypes ?? [];

  return (
    <PageWrapper data-cy="host-page">
      {host && (
        <>
          <PageTitle
            badge={<HostStatusBadge status={status} />}
            buttons={
              <div>
                <ButtonsWrapper>
                  <ButtonSpacer>
                    <Button
                      data-cy="update-status-button"
                      onClick={() => setIsUpdateStatusModalVisible(true)}
                    >
                      Update Status
                    </Button>
                  </ButtonSpacer>
                  <ButtonSpacer>
                    <RestartJasper
                      canRestartJasper={canRestartJasperOrReprovision}
                      hostUrl={hostUrl}
                      isSingleHost
                      jasperTooltipMessage="Jasper cannot be restarted for this host"
                      // @ts-expect-error: FIXME. This comment was added by an automated script.
                      selectedHostIds={[hostId]}
                    />
                  </ButtonSpacer>
                  <ButtonSpacer>
                    <Reprovision
                      canReprovision={canRestartJasperOrReprovision}
                      hostUrl={hostUrl}
                      isSingleHost
                      reprovisionTooltipMessage="This host cannot be reprovisioned"
                      // @ts-expect-error: FIXME. This comment was added by an automated script.
                      selectedHostIds={[hostId]}
                    />
                  </ButtonSpacer>
                </ButtonsWrapper>
              </div>
            }
            loading={hostMetadataLoading}
            pageTitle={`Host${hostId ? ` - ${hostId}` : ""}`}
            size="large"
            title={`Host: ${hostId}`}
          />

          <PageLayout hasSider>
            <PageSider width={350}>
              <Metadata
                error={error}
                host={host}
                loading={hostMetadataLoading}
              />
              {sshAddress && (
                <Code data-cy="ssh-command" language="shell">
                  {sshCommand}
                </Code>
              )}
            </PageSider>
            <PageContent>
              <HostTable
                error={error}
                eventCount={hostEventCount}
                eventLogEntries={hostEventLogEntries}
                eventTypes={hostEventTypes}
                initialFilters={[
                  { id: HostQueryParams.EventType, value: eventTypes },
                ]}
                limit={limit}
                loading={hostEventLoading}
                page={page}
              />
            </PageContent>
          </PageLayout>
        </>
      )}
      <UpdateStatusModal
        closeModal={() => setIsUpdateStatusModalVisible(false)}
        data-cy="update-host-status-modal"
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        hostIds={[hostId]}
        isHostPage
        visible={isUpdateStatusModalVisible}
      />
    </PageWrapper>
  );
};
const ButtonSpacer = styled.span`
  margin-right: ${size.l};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

export default Host;
