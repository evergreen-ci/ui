import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsObject } from "analytics/types";
import { slugs } from "constants/routes";

type Action =
  | { name: "Saved distro"; section: string }
  | { name: "Created new distro"; newDistroId: string }
  | { name: "Clicked duplicate distro"; newDistroId: string };

export const useDistroSettingsAnalytics = () => {
  const { [slugs.distroId]: distroId } = useParams();
  return useAnalyticsRoot<Action, AnalyticsObject>("DistroSettings", {
    distroId,
  });
};
