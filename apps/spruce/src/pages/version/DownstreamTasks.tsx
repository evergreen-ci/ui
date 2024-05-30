import { VersionQuery } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./downstreamTasks/DownstreamProjectAccordion";

interface DownstreamTasksProps {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  childPatches: VersionQuery["version"]["patch"]["childPatches"];
}

export const DownstreamTasks: React.FC<DownstreamTasksProps> = ({
  childPatches,
}) => (
  <>
    {childPatches.map(
      ({
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        githash,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        id,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        parameters,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        projectIdentifier,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        status,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        taskCount,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
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
