import styled from "@emotion/styled";
import { sideNavItemSidePadding } from "@leafygreen-ui/side-nav";
import { Link, useParams, Navigate } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { size } from "@evg-ui/lib/constants/tokens";
import { useImageAnalytics } from "analytics";
import {
  SideNav,
  SideNavItem,
  SideNavPageContent,
  SideNavPageWrapper,
} from "components/styles";
import { ImageTabRoutes, getImageRoute, slugs } from "constants/routes";
import { useFirstImage } from "hooks";
import { ImageSelect } from "./ImageSelect";
import { ImageTabs } from "./Tabs";
import BuildInformationNavItem from "./tabs/BuildInformationTab/BuildInformationNavItem";

const Image: React.FC = () => {
  const { [slugs.imageId]: imageId, [slugs.tab]: currentTab } = useParams<{
    [slugs.imageId]: string;
    [slugs.tab]: ImageTabRoutes;
  }>();
  usePageVisibilityAnalytics({
    attributes: { imageId: imageId ?? "" },
    identifier: "Image",
  });
  const { sendEvent } = useImageAnalytics();

  const { image: firstImage } = useFirstImage();
  const selectedImage = imageId ?? firstImage;
  const scrollContainerId = "side-nav-page-content";

  if (
    currentTab === undefined ||
    !Object.values(ImageTabRoutes).includes(currentTab as ImageTabRoutes)
  ) {
    return (
      <Navigate
        replace
        to={getImageRoute(selectedImage, ImageTabRoutes.BuildInformation)}
      />
    );
  }

  return (
    <SideNavPageWrapper>
      <SideNav aria-label="Image" widthOverride={250}>
        <ButtonsContainer>
          <ImageSelect selectedImage={selectedImage} />
        </ButtonsContainer>
        <BuildInformationNavItem
          key={ImageTabRoutes.BuildInformation}
          currentTab={currentTab}
          imageId={selectedImage}
          scrollContainerId={scrollContainerId}
        />
        <SideNavItem
          key={ImageTabRoutes.EventLog}
          active={ImageTabRoutes.EventLog === currentTab}
          as={Link}
          data-cy={`navitem-${ImageTabRoutes.EventLog}`}
          indentLevel={0}
          onClick={() =>
            sendEvent({ name: "Changed tab", tab: ImageTabRoutes.EventLog })
          }
          to={getImageRoute(selectedImage, ImageTabRoutes.EventLog)}
        >
          Event Log
        </SideNavItem>
      </SideNav>
      <SideNavPageContent id={scrollContainerId}>
        <ImageTabs currentTab={currentTab} imageId={selectedImage} />
      </SideNavPageContent>
    </SideNavPageWrapper>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  margin: 0 ${sideNavItemSidePadding}px;
  margin-bottom: ${size.xs};
`;

export default Image;
