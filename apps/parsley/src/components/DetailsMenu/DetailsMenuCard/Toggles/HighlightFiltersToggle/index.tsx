import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const HighlightFiltersToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { highlightFilters, setHighlightFilters } = preferences;
  const isChecked = highlightFilters;

  const onChange = (checked: boolean) => {
    sendEvent({ name: "Toggled Highlight Filters", on: checked });
    if (checked) {
      setHighlightFilters(true);
    } else {
      setHighlightFilters(false);
    }
  };
  return (
    <BaseToggle
      data-cy="highlight-filters-toggle"
      label="Add Highlights To Filters"
      leftLabel="OFF"
      onChange={onChange}
      rightLabel="ON"
      tooltip="Automatically add matching highlights to filters"
      value={isChecked}
    />
  );
};

export default HighlightFiltersToggle;
