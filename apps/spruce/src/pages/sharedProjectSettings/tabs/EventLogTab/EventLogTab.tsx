import styled from "@emotion/styled";
import InlineDefinition from "@leafygreen-ui/inline-definition";
import { useParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import EventLog from "components/Settings/EventLog";
import { slugs } from "constants/routes";
import { ProjectType } from "../utils";
import { useProjectSettingsEvents } from "./useProjectSettingsEvents";

type TabProps = {
  limit?: number;
  projectType: ProjectType;
};

export const EventLogTab: React.FC<TabProps> = ({ limit, projectType }) => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();

  const isRepo = projectType === ProjectType.Repo;
  const { allEventsFetched, events, fetchMore } = useProjectSettingsEvents(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    projectIdentifier,
    isRepo,
    limit,
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
      customKeyValueRenderConfig={{
        "vars.vars": (val) => (
          <StyledInlineDefinition definition="Evergreen does not display project variable values in the event log for security reasons.">
            {val}
          </StyledInlineDefinition>
        ),
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
    />
  );
};

const StyledInlineDefinition = styled(InlineDefinition)`
  text-underline-offset: ${size.xxs};
`;
