import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import { useFilterParam } from "hooks/useFilterParam";
import BaseToggle from "../BaseToggle";

const HideFiltersToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { hideFilters, setHideFilters } = preferences;

  const [filters, setFilters] = useFilterParam();

  const onChange = (checked: boolean) => {
    sendEvent({ name: "Toggled hide filters", on: checked });
    setHideFilters(checked);
    const newFilters = filters.map((f) => ({
      ...f,
      visible: !checked,
    }));
    setFilters(newFilters);
  };
  return (
    <BaseToggle
      data-cy="hide-filters-toggle"
      label="Hide Filters"
      leftLabel="OFF"
      onChange={onChange}
      rightLabel="ON"
      tooltip="Turn off filters. All active filters will be hidden."
      value={hideFilters}
    />
  );
};

export default HideFiltersToggle;
