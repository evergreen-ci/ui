import { useQuery } from "@apollo/client/react";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import {
  Annotation,
  BuildBaronQuery,
  BuildBaronQueryVariables,
} from "gql/generated/types";
import { BUILD_BARON } from "gql/queries";
import { usePolling } from "hooks/usePolling";
import BuildBaronContent from "./BuildBaronContent";

interface Props {
  taskId: string;
  execution: number;
  annotation: Annotation;
  userCanModify: boolean;
}

const BuildBaron: React.FC<Props> = ({
  annotation,
  execution,
  taskId,
  userCanModify,
}) => {
  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    BuildBaronQuery,
    BuildBaronQueryVariables
  >(BUILD_BARON, {
    variables: { taskId, execution },
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { buildBaron } = data || {};
  if (loading || !buildBaron) {
    return <ParagraphSkeleton />;
  }
  return (
    <BuildBaronContent
      annotation={annotation}
      bbData={buildBaron}
      execution={execution}
      loading={loading}
      taskId={taskId}
      userCanModify={userCanModify}
    />
  );
};

export default BuildBaron;
