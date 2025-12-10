import { Suspense, lazy } from "react";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";

const NotFoundSvg = lazy(() => import("./404/NotFoundSvg"));

const NotFound: React.FC = () => {
  usePageVisibilityAnalytics({ identifier: "404" });
  return (
    <Suspense fallback={<div>Loading</div>}>
      <NotFoundSvg />
    </Suspense>
  );
};

export default NotFound;
