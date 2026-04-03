import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Select, Option } from "@leafygreen-ui/select";
import { TextArea } from "@leafygreen-ui/text-area";
import { Tooltip } from "@leafygreen-ui/tooltip";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useHostsTableAnalytics } from "analytics";
import {
  UpdateHostStatusMutation,
  UpdateHostStatusMutationVariables,
} from "gql/generated/types";
import { UPDATE_HOST_STATUS } from "gql/mutations";
import { UpdateHostStatus } from "types/host";

interface Props {
  visible: boolean;
  "data-cy": string;
  hostIds: string[];
  closeModal: () => void;
  isHostPage: boolean;
}

export const UpdateStatusModal: React.FC<Props> = ({
  closeModal,
  "data-cy": dataCy,
  hostIds,
  isHostPage,
  visible,
}) => {
  const dispatchToast = useToastContext();

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const [status, setHostStatus] = useState<UpdateHostStatus>(null);

  const [notes, setNotesValue] = useState<string>("");

  const hostsTableAnalytics = useHostsTableAnalytics(isHostPage);

  const resetForm = () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    setHostStatus(null);
    setNotesValue("");
  };

  // UPDATE HOST STATUS MUTATION
  const [updateHostStatus, { loading: loadingUpdateHostStatus }] = useMutation<
    UpdateHostStatusMutation,
    UpdateHostStatusMutationVariables
  >(UPDATE_HOST_STATUS, {
    onCompleted({ updateHostStatus: numberOfHostsUpdated }) {
      closeModal();
      const message = isHostPage
        ? `Status was changed to ${status}`
        : `Status was changed to ${status} for ${numberOfHostsUpdated} host${
            numberOfHostsUpdated === 1 ? "" : "s"
          }`;

      dispatchToast.success(message);

      resetForm();
    },
    onError(error) {
      closeModal();
      dispatchToast.error(
        `There was an error updating hosts status: ${error.message}`,
      );
    },
    refetchQueries: ["Hosts"],
  });

  const onClickUpdate = () => {
    hostsTableAnalytics.sendEvent({
      name: "Clicked update host status button",
      "host.status": status,
    });
    updateHostStatus({ variables: { hostIds, status, notes } });
  };

  const onClickCancel = () => {
    closeModal();
    resetForm();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: onClickCancel,
      }}
      confirmButtonProps={{
        children: "Update",
        disabled: !status || loadingUpdateHostStatus,
        onClick: onClickUpdate,
      }}
      data-cy={dataCy}
      open={visible}
      title="Update Host Status"
    >
      <StatusHelpTooltip
        align="top"
        justify="start"
        trigger={
          <HelpRow>
            <Icon glyph="InfoWithCircle" />
            <HelpText>What do these host statuses do?</HelpText>
          </HelpRow>
        }
        triggerEvent="hover"
      >
        <div>
          <strong>Running</strong>: Start the host.
          <br />
          <strong>Quarantined</strong>: Stop a host from running tasks without
          terminating it or shutting it down. This is to do ops work on it like
          temporary maintenance, debugging, etc. Once the maintenance is done,
          it is usually set back to running to pick up tasks like normal.
          Quarantined is used almost exclusively for static hosts.
          <br />
          <strong>Decommissioned</strong>: Terminate a host after it is done
          running its current task.
          <br />
          <strong>Stopped</strong>: Stop the host.
          <br />
          <strong>Terminated</strong>: Shut down the host.
        </div>
      </StatusHelpTooltip>
      <StyledSelect
        data-cy="host-status-select"
        label="Host Status"
        onChange={(s) => {
          setHostStatus(s as UpdateHostStatus);
        }}
        value={status}
      >
        {hostStatuses.map(({ key, title, value }) => (
          <Option key={key} data-cy={`${value}-option`} value={value}>
            {title}
          </Option>
        ))}
      </StyledSelect>
      <TextArea
        data-cy="host-status-notes"
        label="Add Notes"
        onChange={(e) => setNotesValue(e.target.value)}
        rows={6}
        value={notes}
      />
    </ConfirmationModal>
  );
};

const StyledSelect = styled(Select)`
  margin-bottom: ${size.xs};
`;

const HelpRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  margin-bottom: ${size.xs};
`;

const HelpText = styled.span`
  font-size: 12px;
`;

const StatusHelpTooltip = styled(Tooltip)`
  max-width: 320px;
`;

// HOSTS STATUSES DATA FOR SELECT COMPONENT
interface Status {
  title: keyof typeof UpdateHostStatus;
  value: UpdateHostStatus;
  key: UpdateHostStatus;
}

const hostStatuses: Status[] = [
  {
    title: "Decommissioned",
    value: UpdateHostStatus.Decommissioned,
    key: UpdateHostStatus.Decommissioned,
  },
  {
    title: "Quarantined",
    value: UpdateHostStatus.Quarantined,
    key: UpdateHostStatus.Quarantined,
  },
  {
    title: "Running",
    value: UpdateHostStatus.Running,
    key: UpdateHostStatus.Running,
  },
  {
    title: "Terminated",
    value: UpdateHostStatus.Terminated,
    key: UpdateHostStatus.Terminated,
  },
  {
    title: "Stopped",
    value: UpdateHostStatus.Stopped,
    key: UpdateHostStatus.Stopped,
  },
];
