import { ReactNode, useMemo } from "react";
import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { getRandomAprilFoolsImage } from "components/AprilFools";
import { useAprilFoolsEnabled } from "hooks/useAprilFoolsEnabled";

interface Props {
  children: ReactNode; // PreferencesTabs or Project Settings content
}

export const PreferencesAdLayout: React.FC<Props> = ({ children }) => {
  const { enabled: aprilFoolsEnabled } = useAprilFoolsEnabled();
  const showAds = aprilFoolsEnabled;

  const ads = useMemo(
    () => [
      getRandomAprilFoolsImage(),
      getRandomAprilFoolsImage(),
      getRandomAprilFoolsImage(),
    ],
    [],
  );

  return (
    <Root>
      <ContentAndAds>
        <Main>
          <MainInner>{children}</MainInner>
        </Main>
        {showAds && (
          <RightRail>
            {ads.map((src) => (
              <AdBanner key={src} alt="Evergreen Premium Ad" src={src} />
            ))}
          </RightRail>
        )}
      </ContentAndAds>
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
  max-width: 100%;
  overflow: hidden; /* prevent horizontal spill */
`;

const ContentAndAds = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.l};
`;

const Main = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
`;

const MainInner = styled.div`
  width: 100%;
  max-width: 960px; /* tweak to match existing card width */
`;

const RightRail = styled.aside`
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  gap: ${size.m};
`;

const AdBanner = styled.img`
  width: 100%;
  max-height: 160px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
`;
