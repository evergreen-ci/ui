import { useMemo, useRef } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { useParams, useSearchParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { styles } from "hooks/useHTMLStream/utils";
import { getEvergreenUrl } from "utils/environmentVariables";
import { useFileDiffStream } from "./useFileDiffStream";

export const FileDiff: React.FC = () => {
  const { fileName: encodedFileName, versionId } = useParams<{
    versionId: string;
    fileName: string;
  }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLPreElement | null>(null);

  const patchNumber = searchParams.get("patch_number") || "0";
  const commitNumberParam = searchParams.get("commit_number");
  const commitNumber = commitNumberParam ? parseInt(commitNumberParam, 10) : 0;

  // Decode the fileName from URL (it may be URL encoded)
  const fileName = useMemo(() => {
    if (!encodedFileName) {
      return "";
    }
    try {
      return decodeURIComponent(encodedFileName);
    } catch {
      return encodedFileName;
    }
  }, [encodedFileName]);

  const url = useMemo(() => {
    if (!versionId) {
      return null;
    }
    return `${getEvergreenUrl()}/rawdiff/${versionId}/?patch_number=${patchNumber}`;
  }, [patchNumber, versionId]);

  const { error, isLoading } = useFileDiffStream({
    url,
    containerRef,
    fileName,
    commitNumber,
  });

  if (error) {
    return (
      <Container>
        <div>Error loading file diff: {error.message}</div>
      </Container>
    );
  }

  return (
    <Container>
      {fileName && (
        <FileNameContainer>
          <Body weight="medium">{fileName}</Body>
        </FileNameContainer>
      )}
      {isLoading && <ListSkeleton />}
      <Global styles={styles} />
      <pre ref={containerRef} />
    </Container>
  );
};

const Container = styled.div`
  padding: ${size.m};
`;

const FileNameContainer = styled.div`
  margin-bottom: ${size.s};
  padding-bottom: ${size.xs};
  border-bottom: 1px solid ${palette.gray.light2};
`;
