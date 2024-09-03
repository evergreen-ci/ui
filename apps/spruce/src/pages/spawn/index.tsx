import { useParams, Link, Route, Routes, Navigate } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import {
  PageWrapper,
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "components/styles";
import { routes, SpawnTab, slugs } from "constants/routes";
import { SpawnHost } from "./SpawnHost";
import { SpawnVolume } from "./SpawnVolume";

const Spawn: React.FC = () => {
  const { [slugs.tab]: tab } = useParams<{ [slugs.tab]: SpawnTab }>();
  const spawnAnalytics = useSpawnAnalytics();

  return (
    <>
      <SideNav aria-label="Hosts & Volumes">
        <SideNavGroup header="Hosts & Volumes">
          <SideNavItem
            active={tab === SpawnTab.Host}
            as={Link}
            data-cy="host-nav-tab"
            onClick={() =>
              spawnAnalytics.sendEvent({
                name: "Changed tab",
                tab: SpawnTab.Host,
              })
            }
            to={routes.spawnHost}
          >
            Hosts
          </SideNavItem>
          <SideNavItem
            active={tab === SpawnTab.Volume}
            as={Link}
            data-cy="volume-nav-tab"
            onClick={() =>
              spawnAnalytics.sendEvent({
                name: "Changed tab",
                tab: SpawnTab.Volume,
              })
            }
            to={routes.spawnVolume}
          >
            Volumes
          </SideNavItem>
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        <Routes>
          <Route element={<SpawnHost />} path={SpawnTab.Host} />
          <Route element={<SpawnVolume />} path={SpawnTab.Volume} />
          <Route
            element={
              <Navigate replace to={`${routes.spawn}/${SpawnTab.Host}`} />
            }
            path="*"
          />
        </Routes>
      </PageWrapper>
    </>
  );
};

export default Spawn;
