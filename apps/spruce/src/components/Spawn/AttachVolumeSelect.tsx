import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Select, Option } from "@leafygreen-ui/select";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { ModalContent } from "components/Spawn";
import { InputLabel } from "components/styles";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { MY_HOSTS } from "gql/queries";
import { usePolling } from "hooks";
import { HostStatus } from "types/host";

interface HostOption {
  id: string;
  displayName: string;
}

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
  const dispatchToast = useToastContext();
  const [hostOptions, setHostOptions] = useState<HostOption[]>([]); // dropdown option
  const { data, refetch, startPolling, stopPolling } = useQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(MY_HOSTS, {
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (e) => {
      dispatchToast.error(`There was an error loading hosts: ${e.message}`);
    },
  });
  usePolling({ startPolling, stopPolling, refetch });

  // set host dropdown options
  useEffect(() => {
    // User should not be able to make changes to a host if it isn't in the running or stopped status and the host is not in the wrong availability zone
    const canUpdateHost = (status: string, availabilityZone: string) =>
      availabilityZone === targetAvailabilityZone &&
      (status === HostStatus.Running || status === HostStatus.Stopped);
    if (data?.myHosts) {
      const opts = data.myHosts
        // Filter hosts that do not have the same availability zone as the volume.
        .filter(({ availabilityZone, status }) =>
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          canUpdateHost(status, availabilityZone),
        )
        // Map host to a displayName and ID for the dropdown <Option />
        .map(({ displayName, id }) => ({
          id,
          displayName: displayName || id,
        }))
        // Sort the dropdown items by display name.
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
      setHostOptions(opts);
    }
  }, [data, targetAvailabilityZone]);

  // set initially selected host in dropdown
  useEffect(() => {
    if (!selectedHostId && hostOptions.length && autofill) {
      onChange(hostOptions[0].id);
    }
  }, [hostOptions, selectedHostId, onChange, autofill]);

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
        {hostOptions.map(({ displayName, id }) => (
          <Option key={id} data-cy={`${id}-option`} value={id}>
            {displayName}
          </Option>
        ))}
      </Select>
    </ModalContent>
  );
};
