import { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { isTomorrow, parse } from "date-fns";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import Icon from "components/Icon";
import Popconfirm from "components/Popconfirm";
import { days } from "constants/fieldMaps";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
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

export const SpawnHostActionButton: React.FC<{ host: MyHost }> = ({ host }) => {
  const dispatchToast = useToastContext();

  const glyph = mapStatusToGlyph[host.status];
  const action = mapStatusToAction[host.status];
  const canTerminate = host.status !== HostStatus.Terminated;

  // When the UPDATE_SPAWN_HOST_STATUS mutation occurs the host state is not immediately updated, It gets updated a few seconds later.
  // Since the MY_HOSTS query on this components parent polls at a slower rate, this component triggers a poll at a faster interval for that
  // query when it returns an updated host status the polling is halted. This allows the query to poll slowly and not utilize unnecessary bandwith
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

  const handleClick =
    (a: SpawnHostStatusActions, shouldKeepOff?: boolean) =>
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      spawnAnalytics.sendEvent({ name: "Change Host Status", status: a });
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
  const [shouldKeepOff, setShouldKeepOff] = useState(false);

  const nextStartDate: Date = getNextHostStart(host?.sleepSchedule);
  const nextStartDay: string = isTomorrow(nextStartDate)
    ? "tomorrow"
    : days[nextStartDate.getDay()];
  const nextStartTime: string = `${nextStartDate.getHours()}:${nextStartDate.getMinutes().toString().padStart(2, "0")}`;

  return (
    <>
      {host?.sleepSchedule && action === SpawnHostStatusActions.Stop ? (
        <>
          <Button
            disabled={loading || host.status === HostStatus.Stopping}
            leftGlyph={<Icon glyph={glyph} />}
            size={Size.XSmall}
            onClick={() => setSleepModalOpen((o) => !o)}
          />
          <ConfirmationModal
            buttonText={`Pause host ${shouldKeepOff ? "indefinitely" : `until ${nextStartDay}`}`}
            open={sleepModalOpen}
            onCancel={() => setSleepModalOpen(false)}
            // @ts-expect-error
            onConfirm={handleClick(action, shouldKeepOff)}
            setOpen={setSleepModalOpen}
            title="Configure Host Pause"
          >
            <P>
              Since this host has a sleep schedule configured, by default it
              will wake up at the next scheduled start time. If you won&rsquo;t
              need it then, you can pause indefinitely and manually restart it
              at a later date.
            </P>

            {/* LG's radio group does not support boolean values, so cast the state to a string for use by the component */}
            <RadioGroup
              onChange={(e) => setShouldKeepOff(e.target.value === "true")}
              value={`${shouldKeepOff}`}
            >
              <Radio value="false">
                Start host at its next scheduled time ({nextStartDay} at{" "}
                {nextStartTime})
              </Radio>
              <Radio value="true">Pause host indefinitely</Radio>
            </RadioGroup>
          </ConfirmationModal>
        </>
      ) : (
        action && (
          <Button
            disabled={loading || host.status === HostStatus.Stopping}
            leftGlyph={<Icon glyph={glyph} />}
            size={Size.XSmall}
            onClick={handleClick(action)}
          />
        )
      )}
      <Popconfirm
        confirmDisabled={!checkboxAcknowledged}
        onConfirm={handleClick(SpawnHostStatusActions.Terminate)}
        trigger={
          <Button
            size={Size.XSmall}
            disabled={!canTerminate}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Icon glyph="Trash" />
          </Button>
        }
      >
        Delete host “{host.displayName || host.id}”?
        {checkboxLabel && (
          <Checkbox
            label={checkboxLabel}
            onChange={(e) => {
              e.nativeEvent.stopPropagation();
              setCheckboxAcknowledged(!checkboxAcknowledged);
            }}
            checked={checkboxAcknowledged}
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

const getNextHostStart = ({
  dailyStartTime,
  wholeWeekdaysOff,
}: MyHost["sleepSchedule"]): Date => {
  const nextStartDay = parse(dailyStartTime, "HH:mm", new Date());
  do {
    nextStartDay.setDate(nextStartDay.getDate() + 1);
  } while (wholeWeekdaysOff.includes(nextStartDay.getDay()));
  return nextStartDay;
};

const copyPrefix = "I understand that this host is";

const P = styled.p`
  margin-bottom: ${size.s};
`;
