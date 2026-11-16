import { Body } from "@via-ds/components";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { getTriggerRoute } from "constants/routes";
import { VersionTriggerInfoFragment } from "gql/generated/types";
import styles from "./TriggeredBy.module.css";

interface TriggeredByProps {
  onClick?: () => void;
  showSeparator?: boolean;
  upstreamProject: VersionTriggerInfoFragment["upstreamProject"];
}

export const TriggeredBy: React.FC<TriggeredByProps> = ({
  onClick,
  showSeparator = false,
  upstreamProject,
}) => {
  if (!upstreamProject) {
    return null;
  }

  return (
    <>
      {showSeparator && <span aria-hidden>&middot;</span>}
      <Body className={styles.triggeredBy}>
        Triggered by:{" "}
        <StyledRouterLink
          onClick={onClick}
          to={getTriggerRoute({
            triggerType: upstreamProject.triggerType,
            upstreamTask: upstreamProject.task,
            upstreamVersion: upstreamProject.version,
            upstreamRevision: upstreamProject.revision,
            upstreamOwner: upstreamProject.owner,
            upstreamRepo: upstreamProject.repo,
          })}
        >
          {upstreamProject.project}
        </StyledRouterLink>
      </Body>
    </>
  );
};
