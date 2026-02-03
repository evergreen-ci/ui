import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";

type Action =
  | { name: "Saved project settings"; section: string }
  | { name: "Saved repo settings"; section: string }
  | { name: "Clicked default section to repo button"; section: string }
  | {
      name: "Clicked attach project to repo button";
      "repo.owner": string;
      "repo.name": string;
    }
  | {
      name: "Clicked detach project from repo button";
      "repo.owner": string;
      "repo.name": string;
    }
  | {
      name: "Clicked move project to new repo button";
      "repo.owner": string;
      "repo.name": string;
    }
  | { name: "Created new project" }
  | { name: "Created duplicate project from project"; "project.id": string }
  | {
      name: "Redirected to project identifier";
      "project.id": string;
      "project.identifier": string;
    };

export const useProjectSettingsAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("ProjectSettings", {
    "project.identifier": projectIdentifier || "",
  });
};
