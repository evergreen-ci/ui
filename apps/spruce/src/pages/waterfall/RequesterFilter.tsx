import { useTransition } from "react";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
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
  const [, startTransition] = useTransition();
  const [requesters, setRequesters] = useQueryParam(
    WaterfallFilterOptions.Requesters,
    [] as string[],
  );

  const handleChange = (value: string[]) => {
    startTransition(() => {
      setRequesters(value);
    });
    // sendEvent({ name: "Filtered by requester", requesters: value });
  };

  return (
    <Combobox
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
          displayName={requesterToTitle[requester]}
          value={requester}
        />
      ))}
    </Combobox>
  );
};
