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
  featureModalOpen: boolean;
  firstGuideCueOpen: boolean;
  setFirstGuideCueOpen: React.Dispatch<React.SetStateAction<boolean>>;
  secondGuideCueOpen: boolean;
  setSecondGuideCueOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [featureModalOpen, setFeatureModalOpen] = useState(
    !seenSectionsBetaFeatureModal,
  );
  const [firstGuideCueOpen, setFirstGuideCueOpen] = useState<boolean>(
    !featureModalOpen && !seenSectionsBetaGuide,
  );
  const [secondGuideCueOpen, setSecondGuideCueOpen] = useState<boolean>(false);
  const closeFirstGuideCue = () => {
    setSecondGuideCueOpen(true);
    setFirstGuideCueOpen(false);
    sendEvent({
      name: "Clicked sections toggle guide cue close button",
      release: "beta",
    });
  };
  const closeSecondGuideCue = () => {
    setSecondGuideCueOpen(false);
    Cookies.set(SEEN_SECTIONS_BETA_GUIDE_CUE, "true", { expires: 365 });
    sendEvent({
      name: "Clicked jump to failing line toggle guide cue close button",
      release: "beta",
    });
  };
  useEffect(() => {
    if (!featureModalOpen && !seenSectionsBetaGuide) {
      setFirstGuideCueOpen(true);
    }
  }, [featureModalOpen]);

  const closeFeatureModal = () => {
    setFeatureModalOpen(false);
    Cookies.set(SEEN_SECTIONS_BETA_FEATURE_MODAL, "true", { expires: 365 });
  };
  const value = useMemo(
    () => ({
      closeFeatureModal,
      closeFirstGuideCue,
      closeSecondGuideCue,
      featureModalOpen,
      firstGuideCueOpen,
      secondGuideCueOpen,
      setFirstGuideCueOpen,
      setSecondGuideCueOpen,
      showGuideCue: firstGuideCueOpen || secondGuideCueOpen,
    }),
    [firstGuideCueOpen, secondGuideCueOpen, featureModalOpen],
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
