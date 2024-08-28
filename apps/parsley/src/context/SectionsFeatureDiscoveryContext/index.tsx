import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useSectionsFeatureDiscoveryAnalytics } from "analytics/sectionsFeatureDiscovery/useSectionsFeatureDiscoveryAnalytics";
import {
  SEEN_SECTIONS_BETA_FEATURE_MODAL,
  SEEN_SECTIONS_BETA_GUIDE_CUE,
} from "constants/cookies";

const seenSectionsBetaGuide =
  Cookies.get(SEEN_SECTIONS_BETA_GUIDE_CUE) === "true";
const seenSectionsBetaFeatureModal =
  Cookies.get(SEEN_SECTIONS_BETA_FEATURE_MODAL) === "true";
type SectionsFeatureDiscoveryContextState = {
  closeFeatureModal: () => void;
  isOpenFeatureModal: boolean;
  isOpenFirstGuideCue: boolean;
  setIsOpenFirstGuideCue: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenSecondGuideCue: boolean;
  setIsOpenSecondGuideCue: React.Dispatch<React.SetStateAction<boolean>>;
  showGuideCue: boolean;
  closeFirstGuideCue: () => void;
  closeSecondGuideCue: () => void;
};

const SectionsFeatureDiscoveryContext =
  createContext<SectionsFeatureDiscoveryContextState | null>(null);

const useSectionsFeatureDiscoveryContext = () => {
  const context = useContext(SectionsFeatureDiscoveryContext);
  if (context === undefined) {
    throw new Error(
      "useSectionsFeatureDiscoveryContext must be used within a SectionsFeatureDiscoveryContextProvider",
    );
  }
  return context as SectionsFeatureDiscoveryContextState;
};

const SectionsFeatureDiscoveryContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { sendEvent } = useSectionsFeatureDiscoveryAnalytics();
  const [isOpenFeatureModal, setIsOpenFeatureModal] = useState(
    !seenSectionsBetaFeatureModal,
  );
  const [isOpenFirstGuideCue, setIsOpenFirstGuideCue] = useState<boolean>(
    !isOpenFeatureModal && !seenSectionsBetaGuide,
  );
  const [isOpenSecondGuideCue, setIsOpenSecondGuideCue] =
    useState<boolean>(false);
  const closeFirstGuideCue = () => {
    setIsOpenSecondGuideCue(true);
    setIsOpenFirstGuideCue(false);
    sendEvent({
      name: "Clicked sections toggle guide cue close button",
      release: "beta",
    });
  };
  const closeSecondGuideCue = () => {
    setIsOpenSecondGuideCue(false);
    Cookies.set(SEEN_SECTIONS_BETA_GUIDE_CUE, "true");
    sendEvent({
      name: "Clicked jump to failing line toggle guide cue close button",
      release: "beta",
    });
  };
  useEffect(() => {
    if (!isOpenFeatureModal && !seenSectionsBetaGuide) {
      setIsOpenFirstGuideCue(true);
    }
  }, [isOpenFeatureModal]);

  const closeFeatureModal = () => {
    setIsOpenFeatureModal(false);
    Cookies.set(SEEN_SECTIONS_BETA_FEATURE_MODAL, "true");
  };
  const value = useMemo(
    () => ({
      closeFeatureModal,
      closeFirstGuideCue,
      closeSecondGuideCue,
      isOpenFeatureModal,
      isOpenFirstGuideCue,
      isOpenSecondGuideCue,
      setIsOpenFirstGuideCue,
      setIsOpenSecondGuideCue,
      showGuideCue: isOpenFirstGuideCue || isOpenSecondGuideCue,
    }),
    [isOpenFirstGuideCue, isOpenSecondGuideCue, isOpenFeatureModal],
  );

  return (
    <SectionsFeatureDiscoveryContext.Provider value={value}>
      {children}
    </SectionsFeatureDiscoveryContext.Provider>
  );
};

export {
  SectionsFeatureDiscoveryContextProvider,
  useSectionsFeatureDiscoveryContext,
};
