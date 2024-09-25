import styled from "@emotion/styled";
import { sideNavItemSidePadding } from "@leafygreen-ui/side-nav";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavPageContent,
  SideNavPageWrapper,
} from "components/styles";
import { ImageTabRoutes, getImageRoute, slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useFirstImage } from "hooks";
import { getTabTitle } from "./getTabTitle";
import { ImageSelect } from "./ImageSelect";
import { ImageTabs } from "./Tabs";

const Image: React.FC = () => {
  const { [slugs.imageId]: imageId, [slugs.tab]: currentTab } = useParams<{
    [slugs.imageId]: string;
    [slugs.tab]: ImageTabRoutes;
  }>();

  const { image: firstImage } = useFirstImage();

  const selectedImage = imageId ?? firstImage;

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
        <SideNavGroup>
          {Object.values(ImageTabRoutes).map((tab) => (
            <SideNavItem
              key={tab}
              active={tab === currentTab}
              as={Link}
              data-cy={`navitem-${tab}`}
              to={getImageRoute(selectedImage, tab)}
            >
              {getTabTitle(tab).title}
            </SideNavItem>
          ))}
        </SideNavGroup>
      </SideNav>
      <SideNavPageContent>
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
`;

export default Image;
