import { VersionQuery } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./DownstreamProjectAccordion";

type ChildPatches = NonNullable<
  NonNullable<VersionQuery["version"]["patch"]>["childPatches"]
>;

interface DownstreamTasksProps {
  childPatches: ChildPatches;
}

const DownstreamTasks: React.FC<DownstreamTasksProps> = ({ childPatches }) => (
  <>
    {childPatches.map(
      ({
        githash,
        id,
        parameters,
        projectMetadata,
        status,
        taskCount,
        version,
      }) => (
        <DownstreamProjectAccordion
          key={`downstream_project_${id}`}
          baseVersionID={version?.baseVersion?.id ?? ""}
          childPatchId={id}
          githash={githash}
          parameters={parameters}
          projectName={projectMetadata?.identifier ?? ""}
          status={version?.status ?? status}
          taskCount={taskCount ?? 0}
        />
      ),
    )}
  </>
);

export default DownstreamTasks;
