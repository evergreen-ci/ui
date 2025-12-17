import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Select, Option } from "@leafygreen-ui/select";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { ModalContent } from "components/Spawn";
import { InputLabel } from "components/styles";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { MY_HOSTS } from "gql/queries";
import { usePolling } from "hooks";
import { HostStatus } from "types/host";

interface Props {
  targetAvailabilityZone: string;
  selectedHostId: string;
  onChange: (hostId: string) => void;
  label?: string;
  autofill?: boolean;
}

export const AttachVolumeSelect = ({
  autofill,
  label,
  onChange,
  selectedHostId,
  targetAvailabilityZone,
}: Props) => {
  const { data, error, refetch, startPolling, stopPolling } = useQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(MY_HOSTS, {
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading hosts");
  usePolling({ startPolling, stopPolling, refetch });

  const hostDropdownOptions = useMemo(() => {
    // User should not be able to make changes to a host if it isn't in the running or stopped status
    // and if the host is not in the same availability zone.
    const canUpdateHost = (
      status: string | null | undefined,
      availabilityZone: string | null | undefined,
    ) =>
      availabilityZone === targetAvailabilityZone &&
      (status === HostStatus.Running || status === HostStatus.Stopped);

    if (data?.myHosts) {
      return data.myHosts
        .filter(({ availabilityZone, status }) =>
          canUpdateHost(status, availabilityZone),
        )
        .map(({ displayName, id }) => ({
          id,
          displayName: displayName || id,
        }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
    }
    return [];
  }, [data, targetAvailabilityZone]);

  // set initially selected host in dropdown
  useEffect(() => {
    if (!selectedHostId && hostDropdownOptions.length && autofill) {
      onChange(hostDropdownOptions[0].id);
    }
  }, [hostDropdownOptions, selectedHostId, onChange, autofill]);

  return (
    <ModalContent>
      <InputLabel htmlFor="hostDropdown">{label || "Host Name"}</InputLabel>
      <Select
        aria-labelledby="host-select"
        data-cy="host-select"
        id="hostDropdown"
        onChange={onChange}
        style={{ width: 200 }}
        value={selectedHostId}
      >
        {!autofill && (
          <Option key="clear" data-cy="clear-option" value="">
            {" "}
          </Option>
        )}
        {hostDropdownOptions.map(({ displayName, id }) => (
          <Option key={id} data-cy={`${id}-option`} value={id}>
            {displayName}
          </Option>
        ))}
      </Select>
    </ModalContent>
  );
};
