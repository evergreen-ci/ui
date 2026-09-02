import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Banner,
  BannerVariant,
  Body,
  Button,
  Content,
  Dialog,
  DialogRoot,
  Footer,
  Header,
  Select,
  SelectItem,
  Text,
  TextArea,
} from "@via-ds/components";
import pluralize from "pluralize";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useHostsTableAnalytics } from "analytics";
import {
  UpdateHostStatusMutation,
  UpdateHostStatusMutationVariables,
} from "gql/generated/types";
import { UPDATE_HOST_STATUS } from "gql/mutations";
import { UpdateHostStatus } from "types/host";
import styles from "./UpdateStatusModal.module.css";

interface Props {
  visible: boolean;
  "data-testid": string;
  hostIds: string[];
  closeModal: () => void;
  isHostPage: boolean;
}

export const UpdateStatusModal: React.FC<Props> = ({
  closeModal,
  "data-testid": dataTestId,
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

  const statusDescription =
    status != null ? statusDescriptions[status] : undefined;

  return (
    <DialogRoot
      isOpen={visible}
      onOpenChange={(open) => {
        // User-initiated closes (cancel, X, Escape) reset the form; the
        // mutation callbacks call closeModal directly on success/error.
        if (!open) {
          closeModal();
          resetForm();
        }
      }}
    >
      <Dialog data-testid={dataTestId}>
        <Header>
          <Text slot="title">Update Host Status</Text>
        </Header>
        <Content>
          <Body className={styles.body}>
            {`Choose how Evergreen should treat the selected ${pluralize("host", hostIds.length)}.`}
          </Body>

          <Select
            className={styles.select}
            data-testid="host-status-select"
            label="Host Status"
            onChange={(s) => {
              setHostStatus(s as UpdateHostStatus);
            }}
            placeholder="Select"
            value={status}
          >
            {hostStatuses.map(({ key, title, value }) => (
              <SelectItem key={key} data-testid={`${value}-option`} id={value}>
                {title}
              </SelectItem>
            ))}
          </Select>

          {statusDescription && (
            <Banner
              className={styles.statusBanner}
              data-testid="host-status-description"
              variant={BannerVariant.Info}
            >
              {statusDescription}
            </Banner>
          )}

          <TextArea
            className={styles.notes}
            data-testid="host-status-notes"
            label="Add Notes"
            onChange={setNotesValue}
            value={notes}
          />
        </Content>
        <Footer>
          <Button slot="cancel">Cancel</Button>
          {/* No slot="action" on Update: that slot injects an immediate
              close, but this dialog stays open until the mutation resolves
              (matching the old ConfirmationModal semantics). */}
          <Button
            isDisabled={!status || loadingUpdateHostStatus}
            onPress={onClickUpdate}
            variant="primary"
          >
            Update
          </Button>
        </Footer>
      </Dialog>
    </DialogRoot>
  );
};

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
