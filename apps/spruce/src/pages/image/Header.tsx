import { H2, H6 } from "@via-ds/components/typography";
import { ImageTabRoutes } from "constants/routes";
import { getTabTitle } from "./getTabTitle";
import styles from "./Header.module.css";

interface HeaderProps {
  imageId: string;
  tab: ImageTabRoutes;
}

export const Header: React.FC<HeaderProps> = ({ imageId, tab }) => {
  const { title } = getTabTitle(tab);

  return (
    <div className={styles.container} data-testid="image-tab-title">
      <H6 elementType="p">{title}</H6>
      <div className={styles.titleContainer}>
        <H2>{imageId}</H2>
      </div>
    </div>
  );
};
