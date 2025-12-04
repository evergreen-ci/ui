import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const PrettyPrintToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();

  const { prettyPrint, setPrettyPrint } = preferences;

  return (
    <BaseToggle
      data-cy="pretty-print-toggle"
      label="Pretty Print Bookmarks"
      onChange={(value) => {
        setPrettyPrint(value);
        sendEvent({ name: "Toggled pretty print", on: value });
      }}
      tooltip="Pretty print bookmarked lines."
      value={prettyPrint}
    />
  );
};

export default PrettyPrintToggle;
