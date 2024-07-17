import styled from "@emotion/styled";
import { sideNavItemSidePadding } from "@leafygreen-ui/side-nav";
import { Skeleton } from "antd";
import { Link, useParams, Navigate } from "react-router-dom";
import { SideNav, SideNavGroup, SideNavItem } from "components/styles";
import { ImageTabRoutes, getImageRoute, slugs } from "constants/routes";
import { size } from "constants/tokens";
import { getTabTitle } from "./getTabTitle";
import { ImageSelect } from "./ImageSelect";

const Image: React.FC = () => {
  const {
    [slugs.imageId]: imageId,
    [slugs.tab]: currentTab = ImageTabRoutes.BuildInformation,
  } = useParams<{
    [slugs.imageId]: string;
    [slugs.tab]: ImageTabRoutes;
  }>();

  if (!Object.values(ImageTabRoutes).includes(currentTab) && imageId) {
    return (
      <Navigate
        replace
        to={getImageRoute(imageId, ImageTabRoutes.BuildInformation)}
      />
    );
  }

  if (imageId) {
    return (
      <SideNav aria-label="Image" widthOverride={250}>
        <ButtonsContainer>
          <ImageSelect selectedImage={imageId} />
        </ButtonsContainer>
        <SideNavGroup>
          {Object.values(ImageTabRoutes).map((tab) => (
            <SideNavItem
              active={tab === currentTab}
              as={Link}
              key={tab}
              to={getImageRoute(imageId, tab)}
              data-cy={`navitem-${tab}`}
            >
              {getTabTitle(tab).title}
            </SideNavItem>
          ))}
        </SideNavGroup>
      </SideNav>
    );
  }
  return <Skeleton active />;
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  margin: 0 ${sideNavItemSidePadding}px;
`;

export default Image;
