import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Select, Option } from "@leafygreen-ui/select";
import { TextArea } from "@leafygreen-ui/text-area";
import { Body } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
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
        : `Status was changed to ${status} for ${numberOfHostsUpdated} host${pluralize(
            "host",
            numberOfHostsUpdated,
          )}`;

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

  const statusDescription =
    status != null ? statusDescriptions[status] : undefined;

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
      <StyledBody>
        {`Choose how Evergreen should treat the selected ${pluralize("host", hostIds.length)}.`}
      </StyledBody>

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

      {statusDescription && (
        <StatusBanner data-cy="host-status-description" variant={Variant.Info}>
          {statusDescription}
        </StatusBanner>
      )}

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

const StyledBody = styled(Body)`
  margin-bottom: ${size.xs};
`;

const StatusBanner = styled(Banner)`
  margin-bottom: ${size.m};
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

const statusDescriptions: Record<UpdateHostStatus, string> = {
  [UpdateHostStatus.Running]:
    "This status will mark the host as running so Evergreen can schedule tasks on it.",
  [UpdateHostStatus.Quarantined]:
    "This status will stop scheduling new tasks on this host without terminating it. Useful for maintenance or debugging, especially for static hosts.",
  [UpdateHostStatus.Decommissioned]:
    "This status will mark the host for termination once it finishes its current work. Evergreen will clean it up shortly after.",
  [UpdateHostStatus.Stopped]:
    "This status will stop the host so it no longer runs tasks. It can be started again later if supported by the host type.",
  [UpdateHostStatus.Terminated]:
    "This status will permanently shut down the host and remove it from Evergreen. Any in-progress work will not resume on this host.",
};
