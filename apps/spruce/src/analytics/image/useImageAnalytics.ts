import { ColumnFiltersState, PaginationState } from "@leafygreen-ui/table";
import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { ImageTabRoutes, slugs } from "constants/routes";

type Action =
  | {
      name: "Filtered table";
      "table.name":
        | "Image Event Log"
        | "Operating System"
        | "Packages"
        | "Toolchains";
      "table.filters": ColumnFiltersState;
    }
  | {
      name: "Changed table pagination";
      "table.name": "Operating System" | "Packages" | "Toolchains";
      "table.pagination": PaginationState;
    }
  | {
      name: "Changed image";
      from: string;
      to: string;
    }
  | {
      name: "Changed tab";
      tab: ImageTabRoutes;
    }
  | {
      name: "Clicked 'Load more events' button";
    }
  | {
      name: "Used global search";
      search: string;
    };

export const useImageAnalytics = () => {
  const { [slugs.imageId]: imageId } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Image", {
    "image.id": imageId || "",
  });
};
