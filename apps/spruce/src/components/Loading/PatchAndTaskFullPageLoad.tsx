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
    <div className={styles.breadcrumbSkeleton} />
    <div />
    <PageLayout className={styles.pageLayout} hasSider>
      <PageSider>
        <SiderCard>
          <div />
        </SiderCard>
        <SiderCard>
          <div />
        </SiderCard>
      </PageSider>
      <PageContent>
        <div />
      </PageContent>
    </PageLayout>
  </PageWrapper>
);
