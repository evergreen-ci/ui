import { usePreferencesAnalytics } from "analytics";
import { WordWrapFormat } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const WordWrapFormatToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { setWordWrapFormat, wordWrapFormat, wrap } = preferences;
  const isChecked = wordWrapFormat === WordWrapFormat.Aggressive;

  const onChange = (checked: boolean) => {
    if (checked) {
      setWordWrapFormat(WordWrapFormat.Aggressive);
      sendEvent({
        format: WordWrapFormat.Aggressive,
        name: "Toggled word wrap format",
      });
    } else {
      setWordWrapFormat(WordWrapFormat.Standard);
      sendEvent({
        format: WordWrapFormat.Standard,
        name: "Toggled word wrap format",
      });
    }
  };
  return (
    <BaseToggle
      data-cy="word-wrap-format-toggle"
      disabled={!wrap}
      label="Aggressive Word Wrap"
      leftLabel="OFF"
      onChange={onChange}
      rightLabel="ON"
      tooltip="Aggressive wrapping will wrap on any character, while standard wrapping will only wrap on whitespace."
      value={isChecked}
    />
  );
};

export default WordWrapFormatToggle;
