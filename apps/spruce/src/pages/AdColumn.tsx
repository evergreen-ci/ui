import { ReactNode, useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { getLocalStorageBoolean } from "@evg-ui/lib/utils/localStorage";
import { getRandomAprilFoolsImage } from "components/AprilFools";
import { APRIL_FOOLS } from "constants/cookies";

interface Props {
  children: ReactNode;
}

export const PreferencesAdLayout: React.FC<Props> = ({ children }) => {
  const [hasRightRailSpace, setHasRightRailSpace] = useState(false);
  const aprilFoolsEnabled = getLocalStorageBoolean(APRIL_FOOLS, false);

  useEffect(() => {
    const update = () => {
      setHasRightRailSpace(window.innerWidth >= 1280);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const showAds = aprilFoolsEnabled && hasRightRailSpace;

  const ads = useMemo(
    () => [
      getRandomAprilFoolsImage(),
      getRandomAprilFoolsImage(),
      getRandomAprilFoolsImage(),
    ],
    [],
  );

  return (
    <Layout>
      <Main>{children}</Main>
      <Outer>
        <Inner>
          <RightRail>
            {showAds &&
              ads.map((src) => (
                <AdImg key={src} alt="Evergreen Premium Ad" src={src} />
              ))}
          </RightRail>
        </Inner>
      </Outer>
    </Layout>
  );
};

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 320px);
  gap: ${size.l};
  align-items: flex-start;

  @media (max-width: 1279px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Outer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  display: grid;
  grid-template-columns: minmax(0, 960px) auto;
  gap: ${size.l};
  align-items: flex-start;

  @media (max-width: 1279px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.m};
`;

const RightRail = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${size.m};

  @media (max-width: 1279px) {
    display: none;
  }
`;

const AdImg = styled.img`
  width: 100%;
  max-height: 240px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
`;
