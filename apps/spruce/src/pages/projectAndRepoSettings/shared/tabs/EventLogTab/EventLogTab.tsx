import { useParams } from "react-router-dom";
import EventLog from "components/Settings/EventLog";
import { slugs } from "constants/routes";
import { renderVars } from "../../DiffConfig";
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

  const { events, lastFetchedCount, loading, projectFetchMore, repoFetchMore } =
    useProjectSettingsEvents({
      projectIdentifier,
      repoId,
      isRepo: projectType === ProjectType.Repo,
      limit,
    });

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  const handleFetchMore = () => {
    if (projectType === ProjectType.Repo) {
      repoFetchMore({
        variables: {
          repoId,
          before: lastEventTimestamp,
        },
      });
    } else {
      projectFetchMore({
        variables: {
          projectIdentifier,
          before: lastEventTimestamp,
        },
      });
    }
  };

  return (
    <EventLog
      customKeyValueRenderConfig={{
        "vars.vars": renderVars,
      }}
      events={events}
      handleFetchMore={handleFetchMore}
      lastFetchedCount={lastFetchedCount}
      limit={limit}
      loading={loading}
    />
  );
};
