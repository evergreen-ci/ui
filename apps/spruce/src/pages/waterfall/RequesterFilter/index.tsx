import { useTransition } from "react";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { requesterToTitle, mainlineRequesters } from "constants/requesters";
import { WaterfallFilterOptions } from "../types";

export const RequesterFilter = () => {
  const { sendEvent } = useWaterfallAnalytics();
  const [, startTransition] = useTransition();
  const [requesters, setRequesters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Requesters,
    [],
  );

  const handleChange = (value: string[]) => {
    startTransition(() => {
      setRequesters(value);
    });
    sendEvent({ name: "Filtered by requester", requesters: value });
  };

  return (
    <Combobox
      data-cy="requester-filter"
      label="Requesters"
      multiselect
      onChange={handleChange}
      overflow="scroll-x"
      placeholder="Displaying all requesters"
      popoverZIndex={zIndex.popover}
      value={requesters}
    >
      {mainlineRequesters.map((requester) => (
        <ComboboxOption
          key={`${requester}-option`}
          data-cy={`${requester}-option`}
          displayName={requesterToTitle[requester]}
          value={requester}
        />
      ))}
    </Combobox>
  );
};
