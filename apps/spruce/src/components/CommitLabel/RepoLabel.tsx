import { Body } from "@via-ds/components";
import { VersionTriggerInfoFragment } from "gql/generated/types";
import styles from "./RepoLabel.module.css";

interface RepoLabelProps {
  version: Pick<VersionTriggerInfoFragment, "upstreamProject"> & {
    projectMetadata?: { owner: string; repo: string } | null;
  };
}

export const RepoLabel: React.FC<RepoLabelProps> = ({
  version: { projectMetadata, upstreamProject },
}) => {
  const repo = upstreamProject ?? projectMetadata;
  if (!repo) {
    return null;
  }

  return (
    <Body className={styles.text}>
      in {repo.owner}/{repo.repo}
    </Body>
  );
};
