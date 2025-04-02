import Banner from "@leafygreen-ui/banner";
import { StyledRouterLink } from "@evg-ui/lib/src/components/styles";
import { getWaterfallRoute } from "constants/routes";

interface ProjectHealthDeprecationBannerProps {
  projectIdentifier: string;
}

export const ProjectHealthDeprecationBanner: React.FC<
  ProjectHealthDeprecationBannerProps
> = ({ projectIdentifier }) => {
  const formattedDate = "May 6, 2025";

  return (
    <Banner variant="warning">
      The project health page is now deprecated and will be sunset on {formattedDate}.
      Please use the{" "}
      <StyledRouterLink to={getWaterfallRoute(projectIdentifier)}>
        new Waterfall page
      </StyledRouterLink>{" "}
      instead.
    </Banner>
  );
};
