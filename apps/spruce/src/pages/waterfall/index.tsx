import { Suspense } from "react";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams } from "react-router-dom";
import { navBarHeight } from "components/Header/Navbar";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { VERSION_LIMIT } from "./styles";
import { WaterfallFilters } from "./WaterfallFilters";
import { WaterfallGrid } from "./WaterfallGrid";

const Waterfall: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();

  return (
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
        <WaterfallFilters projectIdentifier={projectIdentifier ?? ""} />
        {/* TODO DEVPROD-11708: Use dynamic column limit in skeleton */}
        <Suspense
          fallback={<TableSkeleton numCols={VERSION_LIMIT + 1} numRows={15} />}
        >
          <WaterfallGrid projectIdentifier={projectIdentifier ?? ""} />
        </Suspense>
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
  padding: ${size.m} ${size.l};
`;

export default Waterfall;
