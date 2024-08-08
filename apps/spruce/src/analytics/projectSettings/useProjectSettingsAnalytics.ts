import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsObject } from "analytics/types";
import { slugs } from "constants/routes";

type Action =
  | { name: "Saved project settings"; section: string }
  | { name: "Saved repo settings"; section: string }
  | { name: "Clicked default section to repo button"; section: string }
  | {
      name: "Clicked attach project to repo button";
      repoOwner: string;
      repoName: string;
    }
  | {
      name: "Clicked detach project from repo button";
      repoOwner: string;
      repoName: string;
    }
  | {
      name: "Clicked move project to new repo button";
      repoOwner: string;
      repoName: string;
    }
  | { name: "Created new project" }
  | { name: "Created duplicate project from project"; projectIdToCopy: string }
  | {
      name: "Redirected to project identifier";
      projectId: string;
      projectIdentifier: string;
    };

export const useProjectSettingsAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action, AnalyticsObject>("ProjectSettings", {
    "project.identifier": projectIdentifier || "",
  });
};
