import { VersionQuery } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./downstreamTasks/DownstreamProjectAccordion";

interface DownstreamTasksProps {
  // @ts-ignore: FIXME. This comment was added by an automated script.
  childPatches: VersionQuery["version"]["patch"]["childPatches"];
}

export const DownstreamTasks: React.FC<DownstreamTasksProps> = ({
  childPatches,
}) => (
  <>
    {childPatches.map(
      ({
        // @ts-ignore: FIXME. This comment was added by an automated script.
        githash,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        id,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        parameters,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        projectIdentifier,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        status,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        taskCount,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        versionFull,
      }) => (
        <DownstreamProjectAccordion
          key={`downstream_project_${id}`}
          projectName={projectIdentifier}
          status={versionFull?.status ?? status}
          childPatchId={id}
          taskCount={taskCount}
          githash={githash}
          baseVersionID={versionFull?.baseVersion?.id}
          parameters={parameters}
        />
      ),
    )}
  </>
);
