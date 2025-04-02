import React from "react";
import Banner from "@leafygreen-ui/banner";
import { StyledRouterLink } from "@evg-ui/lib/src/components/styles";
import { getWaterfallRoute } from "../../constants/routes";

interface ProjectHealthDeprecationBannerProps {
  projectIdentifier: string;
}

export const ProjectHealthDeprecationBanner: React.FC<
  ProjectHealthDeprecationBannerProps
> = ({ projectIdentifier }) => {
  const formattedDate = "May 6, 2025";

  return (
    <Banner variant="warning">
      This Project health page will be deprecated on {formattedDate}. Please use
      the{" "}
      <StyledRouterLink to={getWaterfallRoute(projectIdentifier)}>
        new waterfall page
      </StyledRouterLink>{" "}
      instead.
    </Banner>
  );
};
