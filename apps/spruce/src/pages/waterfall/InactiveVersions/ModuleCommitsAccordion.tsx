import { Text } from "@via-ds/components";
import Accordion, {
  AccordionCaretPosition,
} from "@evg-ui/lib/components/Accordion";
import { ModuleGroup } from "../types";
import { VersionLabel, VersionLabelView } from "../VersionLabel";
import styles from "./ModuleCommitsAccordion.module.css";

type ModuleCommitsAccordionProps = {
  group: ModuleGroup;
  highlightedId: string | undefined;
  shouldDisableText: boolean;
};

export const ModuleCommitsAccordion: React.FC<ModuleCommitsAccordionProps> = ({
  group,
  highlightedId,
  shouldDisableText,
}) => {
  const { versions } = group;

  return (
    <Accordion
      caretPosition={AccordionCaretPosition.End}
      className={styles.container}
      defaultOpen
      title={
        <Text
          className={styles.title}
        >{`Module commits (${versions.length})`}</Text>
      }
      useIndent={false}
    >
      <div className={styles.commits}>
        {versions.map((version) => (
          <VersionLabel
            key={version.id}
            highlighted={highlightedId === version.id}
            shouldDisableText={shouldDisableText}
            view={VersionLabelView.Modal}
            {...version}
          />
        ))}
      </div>
    </Accordion>
  );
};
