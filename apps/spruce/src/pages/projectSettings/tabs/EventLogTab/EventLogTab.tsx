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
  const { [slugs.projectIdentifier]: identifier } = useParams();

  const isRepo = projectType === ProjectType.Repo;
  const { allEventsFetched, events, fetchMore } = useProjectSettingsEvents(
    // @ts-ignore: FIXME. This comment was added by an automated script.
    identifier,
    isRepo,
    limit,
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
      // @ts-ignore: FIXME. This comment was added by an automated script.
      events={events}
      handleFetchMore={() => {
        fetchMore({
          variables: {
            identifier,
            before: lastEventTimestamp,
          },
        });
      }}
    />
  );
};
