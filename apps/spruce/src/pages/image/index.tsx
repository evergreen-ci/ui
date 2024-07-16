import { Link, useParams, Navigate } from "react-router-dom";
import { SideNav, SideNavGroup, SideNavItem } from "components/styles";
import { ImageTabRoutes, getImageRoute, slugs } from "constants/routes";
import { getTabTitle } from "./getTabTitle";

const Image: React.FC = () => {
  const {
    [slugs.imageId]: imageId,
    [slugs.tab]: currentTab = ImageTabRoutes.BuildInformation,
  } = useParams<{
    [slugs.imageId]: string;
    [slugs.tab]: ImageTabRoutes;
  }>();

  if (!Object.values(ImageTabRoutes).includes(currentTab)) {
    return (
      <Navigate
        replace
        // @ts-expect-error: TODO fix in DEVPROD-7654
        to={getImageRoute(imageId, ImageTabRoutes.BuildInformation)}
      />
    );
  }

  return (
    <SideNav aria-label="Image" widthOverride={250}>
      <SideNavGroup>
        {Object.values(ImageTabRoutes).map((tab) => (
          <SideNavItem
            active={tab === currentTab}
            as={Link}
            key={tab}
            // @ts-expect-error: TODO fix in DEVPROD-7654
            to={getImageRoute(imageId, tab)}
            data-cy={`navitem-${tab}`}
          >
            {getTabTitle(tab).title}
          </SideNavItem>
        ))}
      </SideNavGroup>
    </SideNav>
  );
};

export default Image;
