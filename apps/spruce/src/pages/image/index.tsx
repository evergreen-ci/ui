import styled from "@emotion/styled";
import { sideNavItemSidePadding } from "@leafygreen-ui/side-nav";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  PageWrapper,
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

  if (!Object.values(ImageTabRoutes).includes(currentTab as ImageTabRoutes)) {
    return (
      <Navigate
        replace
        to={getImageRoute(selectedImage, ImageTabRoutes.BuildInformation)}
      />
    );
  }

  return (
    <>
      <SideNav aria-label="Image" widthOverride={250}>
        <ButtonsContainer>
          <ImageSelect selectedImage={selectedImage} />
        </ButtonsContainer>
        <SideNavGroup>
          {Object.values(ImageTabRoutes).map((tab) => (
            <SideNavItem
              active={tab === currentTab}
              as={Link}
              key={tab}
              to={getImageRoute(selectedImage, tab)}
              data-cy={`navitem-${tab}`}
            >
              {getTabTitle(tab).title}
            </SideNavItem>
          ))}
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        <ImageTabs />
      </PageWrapper>
    </>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  margin: 0 ${sideNavItemSidePadding}px;
`;

export default Image;
