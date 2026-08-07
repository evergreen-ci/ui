import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { mainlineRequesters, requesterToTitle } from "constants/requesters";
import { WaterfallFilterOptions } from "../types";

export const RequesterFilter = () => {
  const { sendEvent } = useWaterfallAnalytics();
  const [requesters, setRequesters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Requesters,
    [],
  );

  const handleChange = (value: string[]) => {
    setRequesters(value);
    sendEvent({ name: "Filtered by requester", requesters: value });
  };

  return (
    <Combobox
      data-testid="requester-filter"
      dropdownWidthBasis="option"
      initialValue={requesters}
      label="Requesters"
      multiselect
      onChange={handleChange}
      overflow="scroll-x"
      placeholder="All"
    >
      {mainlineRequesters.map((requester) => (
        <ComboboxOption
          key={`${requester}-option`}
          data-testid={`${requester}-option`}
          displayName={requesterToTitle[requester]}
          value={requester}
        />
      ))}
    </Combobox>
  );
};
