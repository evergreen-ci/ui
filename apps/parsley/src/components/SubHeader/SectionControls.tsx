import Button from "@leafygreen-ui/button";
import { useLogContext } from "context/LogContext";

const SectionControls = () => {
  const { sectioning } = useLogContext();
  const { sectioningEnabled, toggleAllSections } = sectioning;
  if (!sectioningEnabled) {
    return null;
  }
  return (
    <>
      <Button onClick={() => toggleAllSections(true)} size="small">
        Open all sections
      </Button>
      <Button onClick={() => toggleAllSections(false)} size="small">
        Close all sections
      </Button>
    </>
  );
};

export { SectionControls };
