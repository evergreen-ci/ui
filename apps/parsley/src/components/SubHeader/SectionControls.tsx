import Button from "@leafygreen-ui/button";
import { useLogContext } from "context/LogContext";

const SectionControls = () => {
  const { sectioning } = useLogContext();
  const { sectionState, sectioningEnabled, toggleAllSections } = sectioning;
  if (!sectioningEnabled) {
    return null;
  }
  const allOpen =
    sectionState &&
    Object.values(sectionState).every(
      (section) =>
        section.isOpen &&
        Object.values(section.commands).every((command) => command.isOpen),
    );
  const allClosed =
    sectionState &&
    Object.values(sectionState).every(
      (section) =>
        !section.isOpen &&
        Object.values(section.commands).every((command) => !command.isOpen),
    );

  return (
    <>
      {!allOpen && (
        <Button onClick={() => toggleAllSections(true)} size="small">
          Open all sections
        </Button>
      )}
      {!allClosed && (
        <Button onClick={() => toggleAllSections(false)} size="small">
          Close all sections
        </Button>
      )}
    </>
  );
};

export { SectionControls };
