import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Code from "@leafygreen-ui/code";
import { useParams } from "react-router-dom";
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
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  HostQuery,
  HostQueryVariables,
  HostEventsQuery,
  HostEventsQueryVariables,
} from "gql/generated/types";
import { HOST, HOST_EVENTS } from "gql/queries/index";
import usePagination from "hooks/usePagination";
import { HostTable } from "pages/host/HostTable";
import { Metadata } from "pages/host/Metadata";
import { HostStatus } from "types/host";

const Host: React.FC = () => {
  const dispatchToast = useToastContext();
  const { [slugs.hostId]: hostId } = useParams();
  // Query host data
  const {
    data: hostData,
    error,
    loading: hostMetaDataLoading,
  } = useQuery<HostQuery, HostQueryVariables>(HOST, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: hostId },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the host: ${err.message}`,
      );
    },
  });

  const host = hostData?.host;
  const { distro, hostUrl, persistentDnsName, user } = host || {};
  const bootstrapMethod = distro?.bootstrapMethod;
  const status = host?.status as HostStatus;

  const sshAddress = persistentDnsName || hostUrl;
  const sshCommand = `ssh ${user}@${sshAddress}`;
  const tag = host?.tag ?? "";

  const { limit, page } = usePagination();
  // Query hostEvent data
  const { data: hostEventData, loading: hostEventLoading } = useQuery<
    HostEventsQuery,
    HostEventsQueryVariables
  >(HOST_EVENTS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: hostId, tag, page, limit },
  });

  const hostEvents = hostEventData?.hostEvents;
  const eventsCount = hostEvents?.count;
  // UPDATE STATUS MODAL VISIBILITY STATE
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
    useState<boolean>(false);

  const canRestartJasperOrReprovision =
    host?.status === "running" &&
    (bootstrapMethod === "ssh" || bootstrapMethod === "user-data");
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
            loading={hostMetaDataLoading}
            pageTitle={`Host${hostId ? ` - ${hostId}` : ""}`}
            size="large"
            title={`Host: ${hostId}`}
          />

          <PageLayout hasSider>
            <PageSider width={350}>
              <Metadata
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                error={error}
                host={host}
                loading={hostMetaDataLoading}
              />
              {sshAddress && (
                <Code data-cy="ssh-command" language="shell">
                  {sshCommand}
                </Code>
              )}
            </PageSider>
            <PageContent>
              <HostTable
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                error={error}
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                eventData={hostEventData}
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                eventsCount={eventsCount}
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
