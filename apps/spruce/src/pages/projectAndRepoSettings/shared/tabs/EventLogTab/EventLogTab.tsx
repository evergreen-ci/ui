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

  const { events, handleFetchMore, lastFetchedCount, loading } =
    useProjectSettingsEvents({
      projectIdentifier,
      repoId,
      isRepo: projectType === ProjectType.Repo,
      limit,
    });

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
