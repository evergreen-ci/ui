import { Suspense } from "react";
import styled from "@emotion/styled";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Await, useLoaderData } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { DecodeStreamPayload } from "@evg-ui/lib/utils/streams";

export const RawLog: React.FC = () => {
  const { logLines } = useLoaderData() as { logLines: DecodeStreamPayload };
  return (
    <Suspense
      fallback={
        <Container>
          <ListSkeleton count={25} />
        </Container>
      }
    >
      <Await resolve={logLines}>
        {(lines) =>
          lines.result.map((line: string, i: number) => (
            <div key={i}>
              <code>{line}</code>
            </div>
          ))
        }
      </Await>
    </Suspense>
  );
};

const Container = styled.div`
  padding: ${size.xs};
`;
