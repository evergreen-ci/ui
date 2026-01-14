import styled from "@emotion/styled";
import { InlineDefinition } from "@leafygreen-ui/inline-definition";
import { useParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import EventLog from "components/Settings/EventLog";
import { slugs } from "constants/routes";
import { ProjectType } from "../utils";
import {
  PROJECT_EVENT_LIMIT,
  useProjectSettingsEvents,
} from "./useProjectSettingsEvents";

type TabProps = {
  limit?: number;
  projectType: ProjectType;
};

export const EventLogTab: React.FC<TabProps> = ({
  limit = PROJECT_EVENT_LIMIT,
  projectType,
}) => {
  const {
    [slugs.projectIdentifier]: projectIdentifier,
    [slugs.repoId]: repoId,
  } = useParams();

  const { count, events, fetchMore, loading, previousCount } =
    useProjectSettingsEvents({
      projectIdentifier,
      repoId,
      isRepo: projectType === ProjectType.Repo,
      limit,
    });

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      count={count}
      customKeyValueRenderConfig={{
        "vars.vars": renderVars,
      }}
      events={events}
      handleFetchMore={() => {
        fetchMore({
          variables: {
            projectIdentifier,
            before: lastEventTimestamp,
          },
        });
      }}
      limit={limit}
      loading={loading}
      previousCount={previousCount}
    />
  );
};

const renderVars = (val: string) => (
  <StyledInlineDefinition definition="Evergreen does not display project variable values in the event log for security reasons.">
    {val}
  </StyledInlineDefinition>
);

const StyledInlineDefinition = styled(InlineDefinition)`
  text-underline-offset: ${size.xxs};
`;
