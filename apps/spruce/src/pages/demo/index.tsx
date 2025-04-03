import React from "react";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { PageWrapper } from "components/styles";

const DemoPage: React.FC = () => {
  usePageTitle("Demo Page");

  return (
    <PageWrapper>
      <h1>Demo Page</h1>
      <p>Hey Annie 👋</p>
    </PageWrapper>
  );
};

export default DemoPage;
