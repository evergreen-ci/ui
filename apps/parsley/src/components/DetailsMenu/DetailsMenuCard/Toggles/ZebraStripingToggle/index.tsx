import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const ZebraStripingToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { setZebraStriping, zebraStriping } = preferences;
  return (
    <BaseToggle
      data-cy="zebra-striping-toggle"
      label="Zebra Striping"
      onChange={(value) => {
        setZebraStriping(value);
        sendEvent({ name: "Toggled zebra stripes", on: value });
      }}
      tooltip="Zebra striping alternates the background color of log lines, making it easier to visually track a line across the screen."
      value={zebraStriping}
    />
  );
};

export default ZebraStripingToggle;
