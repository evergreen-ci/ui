import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useVersionAnalytics } from "analytics";
import { MetadataItem } from "components/MetadataCard";
import {
  VersionQuarantinedTasksQuery,
  VersionQuarantinedTasksQueryVariables,
} from "gql/generated/types";
import { VERSION_QUARANTINED_TASKS } from "gql/queries";
import { VersionQuarantinedTestsModal } from "./VersionQuarantinedTestsModal";

type Props = {
  versionId: string;
};

export const QuarantinedTestsSkipped: React.FC<Props> = ({ versionId }) => {
  const { sendEvent } = useVersionAnalytics(versionId);
  const [showModal, setShowModal] = useState(false);

  const { data } = useQuery<
    VersionQuarantinedTasksQuery,
    VersionQuarantinedTasksQueryVariables
  >(VERSION_QUARANTINED_TASKS, { variables: { versionId } });

  const quarantinedTasks = useMemo(
    () =>
      (data?.version.tasks.data ?? []).filter(
        (task) => task.quarantinedTestsSkippedCount > 0,
      ),
    [data],
  );
  const totalCount = quarantinedTasks.reduce(
    (sum, task) => sum + task.quarantinedTestsSkippedCount,
    0,
  );

  if (totalCount === 0) {
    return null;
  }

  return (
    <>
      <MetadataItem as="div" label="Quarantined test skips">
        <BadgeWrapper data-cy="version-quarantined-test-skips">
          <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
            Tests skipped across this version&apos;s tasks because they were
            quarantined in TSS when they ran. This is an execution-time
            snapshot, not the live quarantine state.
          </InfoSprinkle>
          {/* @ts-expect-error: Links should have hrefs. */}
          <StyledLink
            data-cy="version-quarantined-test-skips-link"
            onClick={() => {
              sendEvent({ name: "Viewed version quarantined tests modal" });
              setShowModal(true);
            }}
          >
            <Badge
              data-cy="version-quarantined-test-skips-badge"
              variant={BadgeVariant.Yellow}
            >
              {totalCount}
            </Badge>
          </StyledLink>
        </BadgeWrapper>
      </MetadataItem>
      {showModal && (
        <VersionQuarantinedTestsModal
          open={showModal}
          quarantinedTasks={quarantinedTasks}
          setOpen={setShowModal}
          totalCount={totalCount}
          versionId={versionId}
        />
      )}
    </>
  );
};

const BadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${size.xxs};
  vertical-align: middle;
`;
