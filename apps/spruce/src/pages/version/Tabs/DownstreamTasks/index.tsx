import { Unpacked } from "@evg-ui/lib/types/utils";
import { VersionQuery } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./DownstreamProjectAccordion";

type ChildVersion = Unpacked<
  NonNullable<NonNullable<VersionQuery["version"]["childVersions"]>>
>;

interface DownstreamTasksProps {
  childVersions: ChildVersion[];
}

const DownstreamTasks: React.FC<DownstreamTasksProps> = ({ childVersions }) => (
  <>
    {childVersions.map(
      ({
        baseVersion,
        id,
        parameters,
        projectMetadata,
        revision,
        status,
        taskCount,
      }) => (
        <DownstreamProjectAccordion
          key={`downstream_project_${id}`}
          baseVersionID={baseVersion?.id ?? ""}
          childPatchId={id}
          githash={revision}
          parameters={parameters}
          projectName={projectMetadata?.identifier ?? ""}
          status={status}
          taskCount={taskCount ?? 0}
        />
      ),
    )}
  </>
);

export default DownstreamTasks;
