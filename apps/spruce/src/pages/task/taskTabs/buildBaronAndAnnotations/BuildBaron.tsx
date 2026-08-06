import { useQuery } from "@apollo/client/react";
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
  projectId?: string;
}

const BuildBaron: React.FC<Props> = ({
  annotation,
  execution,
  projectId,
  taskId,
  userCanModify,
}) => {
  const { data, loading } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(
    BUILD_BARON,
    {
      variables: { taskId, execution },
    },
  );

  const suggestions = data?.task?.buildBaronSuggestions;
  const isLoading = !data && loading; // TODO: Re-evaluate in DEVPROD-33191.
  if (isLoading) {
    return <ParagraphSkeleton />;
  }
  return (
    <BuildBaronContent
      annotation={annotation}
      execution={execution}
      projectId={projectId}
      suggestions={suggestions}
      taskId={taskId}
      userCanModify={userCanModify}
    />
  );
};

export default BuildBaron;
