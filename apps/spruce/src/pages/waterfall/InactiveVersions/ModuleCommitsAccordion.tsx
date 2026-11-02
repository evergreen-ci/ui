import { Body, Link, Text } from "@via-ds/components";
import Accordion, {
  AccordionCaretPosition,
} from "@evg-ui/lib/components/Accordion";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { getGithubCommitUrl } from "constants/externalResources";
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
  const { project, revision } = versions[0];

  return (
    <Accordion
      caretPosition={AccordionCaretPosition.End}
      className={styles.container}
      defaultOpen
      subtitle={
        project && (
          <Body className={styles.basedOn}>
            Based on {project.owner}/{project.repo}{" "}
            <Link
              href={getGithubCommitUrl(project.owner, project.repo, revision)}
            >
              <Text textStyle="inlineCode">{shortenGithash(revision)}</Text>
            </Link>
          </Body>
        )
      }
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
