import { Suspense } from "react";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { navBarHeight } from "components/Header/Navbar";
import { size } from "constants/tokens";
import { VERSION_LIMIT } from "./styles";
import { WaterfallGrid } from "./WaterfallGrid";

const Waterfall: React.FC = () => (
  <>
    {/* Safari performance of the waterfall chokes if using overflow-y: scroll, so we need the page to scroll instead.
    Update navbar layout to accommodate this. */}
    <Global
      styles={css`
        header {
          position: unset !important;
        }
        #banner-container {
          margin-top: calc(${navBarHeight} + ${size.s});
        }
        nav {
          position: fixed !important;
          width: 100%;
          z-index: 1;
        }
      `}
    />
    <PageContainer data-cy="waterfall-page">
      {/* TODO DEVPROD-11708: Use dynamic column limit in skeleton */}
      <Suspense
        fallback={<TableSkeleton numCols={VERSION_LIMIT + 1} numRows={15} />}
      >
        <WaterfallGrid />
      </Suspense>
    </PageContainer>
  </>
);

const PageContainer = styled.div`
  padding: ${size.m} ${size.l};
`;

export default Waterfall;
