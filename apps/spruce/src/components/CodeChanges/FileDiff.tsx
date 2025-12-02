import { useRef } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { useParams, useSearchParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { styles } from "hooks/useHTMLStream/utils";
import { useFileDiffStream } from "./useFileDiffStream";
import { getRawDiffUrl } from "./utils";

export const FileDiff: React.FC = () => {
  const { fileName: encodedFileName, versionId } = useParams<{
    versionId: string;
    fileName: string;
  }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLPreElement | null>(null);

  const fileName = encodedFileName ? decodeURIComponent(encodedFileName) : "";
  const patchNumber = searchParams.get("patch_number") || "0";
  const commitNumber =
    parseInt(searchParams.get("commit_number") || "0", 10) || 0;
  const url = getRawDiffUrl(versionId, patchNumber);

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
