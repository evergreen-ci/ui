import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";

type Action =
  | { name: "Saved distro"; section: string }
  | { name: "Created new distro"; "distro.id": string }
  | { name: "Clicked duplicate distro"; "distro.id": string }
  | {
      name: "Clicked link";
      link: "Task Queue" | "Image Build Information" | "Image Event Log";
    };

export const useDistroSettingsAnalytics = () => {
  const { [slugs.distroId]: distroId } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("DistroSettings", {
    "distro.id": distroId || "",
  });
};
