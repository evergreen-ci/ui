import { useMemo, useRef } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, useSearchParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { styles } from "hooks/useHTMLStream/utils";
import { getEvergreenUrl } from "utils/environmentVariables";
import { useDiffStream } from "./useDiffStream";

export const DiffPage: React.FC = () => {
  const { versionId } = useParams<{ versionId: string }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLPreElement | null>(null);

  const patchNumber = searchParams.get("patch_number") || "0";

  const url = useMemo(() => {
    if (!versionId) {
      return null;
    }
    return `${getEvergreenUrl()}/rawdiff/${versionId}/?patch_number=${patchNumber}`;
  }, [patchNumber, versionId]);

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
