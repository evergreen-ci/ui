import { useId, useState } from "react";
import { Body, Link, Text } from "@via-ds/components";
import ChevronDown from "@via-ds/icons/ChevronDown";
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
  const [expanded, setExpanded] = useState(true);
  const commitsId = useId();

  const { versions } = group;
  const { project, revision } = versions[0];

  return (
    <div className={styles.container}>
      <button
        aria-controls={commitsId}
        aria-expanded={expanded}
        className={styles.toggle}
        onClick={() => setExpanded((prev) => !prev)}
        type="button"
      >
        <Text
          className={styles.title}
        >{`Module commits (${versions.length})`}</Text>
        <ChevronDown aria-hidden className={styles.chevron} size="small" />
      </button>
      {project && (
        <Body className={styles.basedOn}>
          Based on {project.owner}/{project.repo}{" "}
          <Link
            href={getGithubCommitUrl(project.owner, project.repo, revision)}
          >
            <Text textStyle="inlineCode">{shortenGithash(revision)}</Text>
          </Link>
        </Body>
      )}
      <div className={styles.commits} hidden={!expanded} id={commitsId}>
        {versions.map((version) => (
          <VersionLabel
            key={version.id}
            highlighted={highlightedId === version.id}
            isFirstVersion={false}
            shouldDisableText={shouldDisableText}
            view={VersionLabelView.Modal}
            {...version}
          />
        ))}
      </div>
    </div>
  );
};
