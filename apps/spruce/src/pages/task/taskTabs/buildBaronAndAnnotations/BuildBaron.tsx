import { useQuery } from "@apollo/client";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import {
  Annotation,
  BuildBaronQuery,
  BuildBaronQueryVariables,
} from "gql/generated/types";
import { BUILD_BARON } from "gql/queries";
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
  const { data, loading } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(
    BUILD_BARON,
    {
      variables: { taskId, execution },
    },
  );
  if (loading) {
    return <ParagraphSkeleton />;
  }
  return (
    <BuildBaronContent
      annotation={annotation}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      bbData={data?.buildBaron}
      execution={execution}
      loading={loading}
      taskId={taskId}
      userCanModify={userCanModify}
    />
  );
};

export default BuildBaron;
