import { Navigate, Route, Routes } from "react-router-dom";
import { ImageTabRoutes } from "constants/routes";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { Header } from "./Header";
import { BuildInformationTab, EventLogTab } from "./tabs/index";
import styles from "./Tabs.module.css";

type ImageTabsProps = {
  imageId: string;
  currentTab: ImageTabRoutes;
};

export const ImageTabs: React.FC<ImageTabsProps> = ({
  currentTab,
  imageId,
}) => {
  useScrollToAnchor();

  return (
    <div className={styles.container}>
      <Header imageId={imageId} tab={currentTab} />
      <Routes>
        <Route
          element={<Navigate replace to={ImageTabRoutes.BuildInformation} />}
          path="*"
        />
        <Route
          element={<BuildInformationTab key={imageId} imageId={imageId} />}
          path={ImageTabRoutes.BuildInformation}
        />
        <Route
          element={<EventLogTab key={imageId} imageId={imageId} />}
          path={ImageTabRoutes.EventLog}
        />
      </Routes>
    </div>
  );
};
