import { useParams } from "react-router-dom";
import { EventLog } from "components/Settings/EventLog";
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
    projectIdentifier,
    isRepo,
    limit,
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
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
