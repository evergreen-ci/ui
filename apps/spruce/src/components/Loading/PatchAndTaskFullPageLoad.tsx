import {
  ListSkeleton,
  Size,
  Skeleton,
  TableSkeleton,
} from "@leafygreen-ui/skeleton-loader";
import {
  PageContent,
  PageLayout,
  PageSider,
  PageWrapper,
  SiderCard,
} from "components/styles";
import styles from "./PatchAndTaskFullPageLoad.module.css";

export const PatchAndTaskFullPageLoad: React.FC = () => (
  <PageWrapper>
    <Skeleton className={styles.breadcrumbSkeleton} size={Size.Small} />
    <Skeleton />
    <PageLayout className={styles.pageLayout} hasSider>
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
    </PageLayout>
  </PageWrapper>
);
