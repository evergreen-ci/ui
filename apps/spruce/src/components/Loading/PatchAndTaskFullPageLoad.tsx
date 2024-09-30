import { Skeleton } from "antd";
import {
  PageContent,
  PageLayout,
  PageSider,
  PageWrapper,
  SiderCard,
} from "components/styles";

export const PatchAndTaskFullPageLoad: React.FC = () => (
  <PageWrapper>
    <Skeleton active paragraph />
    <PageLayout hasSider>
      <PageSider>
        <SiderCard>
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </SiderCard>
        <SiderCard>
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </SiderCard>
      </PageSider>
      <PageContent>
        <Skeleton active paragraph={{ rows: 8 }} title />
      </PageContent>
    </PageLayout>
  </PageWrapper>
);
