import { createContext, useContext, useMemo, useRef, useState } from "react";
import { useFindClosestRef } from "hooks";

type BuildInformationContextState = {
  activeIndex: number;
  generalRef: React.RefObject<HTMLDivElement>;
  osRef: React.RefObject<HTMLDivElement>;
  distrosRef: React.RefObject<HTMLDivElement>;
  packagesRef: React.RefObject<HTMLDivElement>;
  toolchainsRef: React.RefObject<HTMLDivElement>;
  buildInformationSections: { title: string; id: string }[];
};

const buildInformationSections = [
  {
    title: "General",
    id: "general",
  },
  {
    title: "Distros",
    id: "distros",
  },
  {
    title: "Operating System",
    id: "operating-system",
  },
  {
    title: "Packages",
    id: "packages",
  },
  {
    title: "Toolchains",
    id: "toolchains",
  },
];

const BuildInformationContext =
  createContext<BuildInformationContextState | null>(null);

const useBuildInformationContext = () => {
  const context = useContext(BuildInformationContext);
  if (context === undefined) {
    throw new Error(
      "useBuildInformationContext must be used within a BuildInformationContextProvider",
    );
  }
  return context as BuildInformationContextState;
};

const BuildInformationContextProvider: React.FC<{
  children: React.ReactNode;
  scrollContainerId: string;
}> = ({ children, scrollContainerId }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const generalRef = useRef<HTMLDivElement>(null);
  const distrosRef = useRef<HTMLDivElement>(null);
  const osRef = useRef<HTMLDivElement>(null);
  const packagesRef = useRef<HTMLDivElement>(null);
  const toolchainsRef = useRef<HTMLDivElement>(null);

  useFindClosestRef({
    refs: [generalRef, distrosRef, osRef, packagesRef, toolchainsRef],
    setActiveIndex,
    scrollContainerId,
  });

  const memoizedContext = useMemo(
    () => ({
      activeIndex,
      generalRef,
      osRef,
      distrosRef,
      packagesRef,
      toolchainsRef,
      buildInformationSections,
    }),
    [activeIndex, generalRef, osRef, distrosRef, packagesRef, toolchainsRef],
  );

  return (
    <BuildInformationContext.Provider value={memoizedContext}>
      {children}
    </BuildInformationContext.Provider>
  );
};

export { BuildInformationContextProvider, useBuildInformationContext };
