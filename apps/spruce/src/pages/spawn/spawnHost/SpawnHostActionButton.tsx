import { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Button, Size } from "@leafygreen-ui/button";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { Disclaimer } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useSpawnAnalytics } from "analytics";
import { isSleepScheduleActive } from "components/Spawn";
import {
  UpdateSpawnHostStatusMutation,
  UpdateSpawnHostStatusMutationVariables,
  SpawnHostStatusActions,
  MyHostsQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import { UPDATE_SPAWN_HOST_STATUS } from "gql/mutations";
import { MY_HOSTS } from "gql/queries";
import { usePolling } from "hooks";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { PauseSleepScheduleModal } from "./PauseSleepScheduleModal";

export const SpawnHostActionButton: React.FC<{ host: MyHost }> = ({ host }) => {
  const dispatchToast = useToastContext();

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const glyph = mapStatusToGlyph[host.status];
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const action = mapStatusToAction[host.status];
  const canTerminate = host.status !== HostStatus.Terminated;
  const canReboot = host.status === HostStatus.Running;

  // When the UPDATE_SPAWN_HOST_STATUS mutation occurs the host state is not immediately updated, It gets updated a few seconds later.
  // Since the MY_HOSTS query on this components parent polls at a slower rate, this component triggers a poll at a faster interval for that
  // query when it returns an updated host status the polling is halted. This allows the query to poll slowly and not utilize unnecessary bandwidth
  // except when an action is performed and we need to fetch updated data.
  const [getMyHosts, { refetch, startPolling, stopPolling }] = useLazyQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(MY_HOSTS, {
    pollInterval: 3000,
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading your spawn hosts: ${e.message}`,
      );
    },
  });
  usePolling({
    startPolling,
    stopPolling,
    refetch,
    initialPollingState: false,
  });
  // Stop polling when we get updated host data
  useEffect(() => {
    if (stopPolling) {
      stopPolling();
    }
  }, [host]); // eslint-disable-line react-hooks/exhaustive-deps

  const spawnAnalytics = useSpawnAnalytics();

  const [updateSpawnHostStatus, { loading }] = useMutation<
    UpdateSpawnHostStatusMutation,
    UpdateSpawnHostStatusMutationVariables
  >(UPDATE_SPAWN_HOST_STATUS, {
    onCompleted() {
      dispatchToast.success(`Successfully triggered host status update!`);
      getMyHosts();
    },
    onError(err) {
      dispatchToast.error(
        `There was an error while updating your host: ${err.message}`,
      );
    },
    refetchQueries: ["MyVolumes"],
  });

  const handleClick = (a: SpawnHostStatusActions, shouldKeepOff?: boolean) => {
    spawnAnalytics.sendEvent({ name: "Changed host status", "host.status": a });
    updateSpawnHostStatus({
      variables: {
        updateSpawnHostStatusInput: {
          hostId: host.id,
          action: a,
          shouldKeepOff,
        },
      },
    });
  };

  let checkboxLabel = "";
  if (host.noExpiration && host.distro?.isVirtualWorkStation) {
    checkboxLabel = `${copyPrefix} a workstation and unexpirable.`;
  } else if (host.noExpiration) {
    checkboxLabel = `${copyPrefix} unexpirable.`;
  } else if (host.distro?.isVirtualWorkStation) {
    checkboxLabel = `${copyPrefix} a virtual workstation.`;
  }

  const [checkboxAcknowledged, setCheckboxAcknowledged] =
    useState(!checkboxLabel);

  const [sleepModalOpen, setSleepModalOpen] = useState(false);

  return (
    <>
      {isSleepScheduleActive({
        isTemporarilyExempt: !!(host?.sleepSchedule
          ?.temporarilyExemptUntil as unknown as string),
        noExpiration: host.noExpiration,
        permanentlyExempt: !!host?.sleepSchedule?.permanentlyExempt,
      }) && action === SpawnHostStatusActions.Stop ? (
        <>
          <Button
            data-cy="pause-unexpirable-host-button"
            disabled={loading || host.status === HostStatus.Stopping}
            leftGlyph={<Icon glyph={glyph} />}
            onClick={() => setSleepModalOpen((o) => !o)}
            size={Size.XSmall}
          />
          <PauseSleepScheduleModal
            handleConfirm={(shouldKeepOff) =>
              handleClick(action, shouldKeepOff)
            }
            open={sleepModalOpen}
            setOpen={setSleepModalOpen}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            sleepSchedule={host.sleepSchedule}
          />
        </>
      ) : (
        action && (
          <Button
            disabled={loading || host.status === HostStatus.Stopping}
            leftGlyph={<Icon glyph={glyph} />}
            onClick={() => handleClick(action)}
            size={Size.XSmall}
          />
        )
      )}
      <Popconfirm
        onConfirm={() => handleClick(SpawnHostStatusActions.Reboot)}
        trigger={
          <Button
            disabled={!canReboot}
            onClick={(e) => {
              e.stopPropagation();
            }}
            size={Size.XSmall}
          >
            <Icon glyph="Refresh" />
          </Button>
        }
      >
        Reboot host “{host.displayName || host.id}”?
        <Disclaimer>
          After triggering a reboot, you will need to wait a few minutes before
          you can SSH into the machine again.
        </Disclaimer>
      </Popconfirm>
      <Popconfirm
        confirmDisabled={!checkboxAcknowledged}
        onConfirm={() => handleClick(SpawnHostStatusActions.Terminate)}
        trigger={
          <Button
            disabled={!canTerminate}
            onClick={(e) => {
              e.stopPropagation();
            }}
            size={Size.XSmall}
          >
            <Icon glyph="Trash" />
          </Button>
        }
      >
        Delete host “{host.displayName || host.id}”?
        {checkboxLabel && (
          <Checkbox
            checked={checkboxAcknowledged}
            label={checkboxLabel}
            onChange={(e) => {
              e.nativeEvent.stopPropagation();
              setCheckboxAcknowledged(!checkboxAcknowledged);
            }}
          />
        )}
      </Popconfirm>
    </>
  );
};
const mapStatusToAction = {
  [HostStatus.Running]: SpawnHostStatusActions.Stop,
  [HostStatus.Stopping]: SpawnHostStatusActions.Stop,
  [HostStatus.Stopped]: SpawnHostStatusActions.Start,
};

const mapStatusToGlyph = {
  [HostStatus.Running]: "Pause",
  [HostStatus.Stopping]: "Pause",
  [HostStatus.Stopped]: "Play",
};

const copyPrefix = "I understand that this host is";
