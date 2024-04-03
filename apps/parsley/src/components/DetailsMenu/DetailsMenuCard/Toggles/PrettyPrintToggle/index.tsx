import { usePreferencesAnalytics } from "analytics";
import { LogRenderingTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const PrettyPrintToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata, preferences } = useLogContext();

  const { prettyPrint, setPrettyPrint } = preferences;
  const disablePrettyPrint = logMetadata?.renderingType !== LogRenderingTypes.Resmoke;

  return (
    <BaseToggle
      data-cy="pretty-print-toggle"
      disabled={disablePrettyPrint}
      label="Pretty Print Bookmarks"
      onChange={(value) => {
        setPrettyPrint(value);
        sendEvent({ name: "Toggled Pretty Print", on: value });
      }}
      tooltip="Toggle pretty printing for bookmarked lines. Only available for resmoke logs."
      value={prettyPrint}
    />
  );
};

export default PrettyPrintToggle;
