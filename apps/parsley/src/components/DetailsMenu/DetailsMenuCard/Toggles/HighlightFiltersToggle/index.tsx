import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const HighlightFiltersToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { highlightFilters, setHighlightFilters } = preferences;
  const isChecked = highlightFilters;

  const onChange = (checked: boolean) => {
    sendEvent({ name: "Toggled highlight filters", on: checked });
    setHighlightFilters(checked);
  };
  return (
    <BaseToggle
      data-cy="highlight-filters-toggle"
      label="Highlight Filters"
      leftLabel="OFF"
      onChange={onChange}
      rightLabel="ON"
      tooltip="Automatically add matching highlights to filters"
      value={isChecked}
    />
  );
};

export default HighlightFiltersToggle;
