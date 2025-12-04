import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import NotFound from "components/404/NotFound";

export const PageDoesNotExist: React.FC = () => {
  usePageVisibilityAnalytics({ identifier: "NotFound" });
  return <NotFound />;
};
