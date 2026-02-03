import styled from "@emotion/styled";
import {
  Skeleton,
  ListSkeleton,
  TableSkeleton,
  Size,
} from "@leafygreen-ui/skeleton-loader";
import { size } from "@evg-ui/lib/constants";
import {
  PageContent,
  PageLayout,
  PageSider,
  PageWrapper,
  SiderCard,
} from "components/styles";

export const PatchAndTaskFullPageLoad: React.FC = () => (
  <PageWrapper>
    <BreadCrumbSkeleton size={Size.Small} />
    <Skeleton />
    <StyledPageLayout hasSider>
      <PageSider>
        <SiderCard>
          <ListSkeleton />
        </SiderCard>
        <SiderCard>
          <ListSkeleton />
        </SiderCard>
      </PageSider>
      <PageContent>
        <TableSkeleton numRows={10} />
      </PageContent>
    </StyledPageLayout>
  </PageWrapper>
);

const StyledPageLayout = styled(PageLayout)`
  margin-top: ${size.s};
`;

const BreadCrumbSkeleton = styled(Skeleton)`
  width: 300px;
  margin-bottom: ${size.s};
`;
