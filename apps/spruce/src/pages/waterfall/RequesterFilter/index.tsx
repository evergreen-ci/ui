import { Combobox, ComboboxItem } from "@via-ds/components/combobox";
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

  const handleChange = (keys: React.Key[]) => {
    const value = keys.map(String);
    setRequesters(value);
    sendEvent({ name: "Filtered by requester", requesters: value });
  };

  return (
    <Combobox<object, "multiple">
      data-testid="requester-filter"
      dropdownWidthBasis="option"
      label="Requesters"
      menuTriggerAriaLabel="Requesters"
      onChange={handleChange}
      placeholder="All"
      selectionMode="multiple"
      showChips={false}
      value={requesters}
    >
      {mainlineRequesters.map((requester) => (
        <ComboboxItem
          key={`${requester}-option`}
          data-testid={`${requester}-option`}
          id={requester}
          textValue={requesterToTitle[requester]}
        >
          {requesterToTitle[requester]}
        </ComboboxItem>
      ))}
    </Combobox>
  );
};
