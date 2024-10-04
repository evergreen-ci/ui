import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { SideNavItem } from "components/styles";
import { ImageTabRoutes, getImageRoute } from "constants/routes";
import { useBuildInformationContext } from "./BuildInformationContext";

type BuildInformationNavItemProps = {
  imageId: string;
  currentTab: ImageTabRoutes;
};

const BuildInformationNavItem: React.FC<BuildInformationNavItemProps> = ({
  currentTab,
  imageId,
}) => {
  const { activeIndex, buildInformationSections } =
    useBuildInformationContext();
  const tabIsActive = ImageTabRoutes.BuildInformation === currentTab;

  return (
    <>
      <SideNavItem
        key={ImageTabRoutes.BuildInformation}
        active={tabIsActive}
        as={Link}
        data-cy={`navitem-${ImageTabRoutes.BuildInformation}`}
        indentLevel={0}
        to={getImageRoute(imageId, ImageTabRoutes.BuildInformation)}
      >
        Build Information
      </SideNavItem>
      {buildInformationSections.map((s, idx) => {
        const isActive = tabIsActive && activeIndex === idx;
        return (
          <SideNavItem
            key={s.id}
            active={isActive}
            as={Link}
            css={css`
              border-left: none;
              ::before {
                background-color: transparent;
              }
            `}
            data-active={isActive}
            data-cy={`navitem-${s.id}`}
            indentLevel={3}
            to={getImageRoute(imageId, ImageTabRoutes.BuildInformation, s.id)}
          >
            {s.title}
          </SideNavItem>
        );
      })}
    </>
  );
};

export default BuildInformationNavItem;
