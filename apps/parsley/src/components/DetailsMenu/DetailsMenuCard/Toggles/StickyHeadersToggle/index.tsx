import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const StickyHeadersToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences, sectioning } = useLogContext();
  const { setStickyHeaders, stickyHeaders } = preferences;

  return (
    <BaseToggle
      data-cy="sticky-headers-toggle"
      disabled={!sectioning.sectioningEnabled}
      label="Sticky Headers"
      onChange={(value) => {
        setStickyHeaders(value);
        sendEvent({ name: "Toggled sticky headers", on: value });
      }}
      tooltip="Makes function & command headers sticky. Only available when sections are enabled."
      value={stickyHeaders}
    />
  );
};

export default StickyHeadersToggle;
