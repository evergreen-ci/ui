import { useTransition } from "react";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useWaterfallAnalytics } from "analytics";
import { Requester, requesterToTitle } from "constants/requesters";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";

const commitRequesters = [
  Requester.AdHoc,
  Requester.GitTag,
  Requester.Gitter,
  Requester.Trigger,
];

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
      // Use an uncontrolled component so that the transition does not affect combobox rendering
      initialValue={requesters}
      label="Requesters"
      multiselect
      onChange={handleChange}
      overflow="scroll-x"
      placeholder="Displaying all requesters"
    >
      {commitRequesters.map((requester) => (
        <ComboboxOption
          data-cy={`${requester}-option`}
          displayName={requesterToTitle[requester]}
          value={requester}
        />
      ))}
    </Combobox>
  );
};
