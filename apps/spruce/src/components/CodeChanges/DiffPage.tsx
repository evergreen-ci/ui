import { useMemo, useRef } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { styles } from "hooks/useHTMLStream/utils";
import { getEvergreenUrl } from "utils/environmentVariables";
import { useDiffStream } from "./useDiffStream";

export const DiffPage: React.FC = () => {
  const { versionId } = useParams<{ versionId: string }>();
  const containerRef = useRef<HTMLPreElement | null>(null);

  const url = useMemo(() => {
    if (!versionId) {
      return null;
    }
    // TODO: Full diff always uses patch_number=0, so we can hardcode this for now.
    return `${getEvergreenUrl()}/rawdiff/${versionId}/?patch_number=0`;
  }, [versionId]);

  const { error, isLoading } = useDiffStream({
    url,
    containerRef,
  });

  if (error) {
    return (
      <Container>
        <div>Error loading diff: {error.message}</div>
      </Container>
    );
  }

  return (
    <Container>
      {isLoading && <ListSkeleton />}
      <Global styles={styles} />
      <pre ref={containerRef} />
    </Container>
  );
};

const Container = styled.div`
  padding: ${size.m};
`;
