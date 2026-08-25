import {
  AdminBanner,
  ConnectivityBanner,
  GithubUsernameBanner,
  SlackNotificationBanner,
} from "components/Banners";
import styles from "./index.module.css";
import { Navbar } from "./Navbar";

export const Header: React.FC = () => (
  <header className={styles.header}>
    <Navbar />
    <div className={styles.bannerContainer} id="banner-container">
      <AdminBanner />
      <ConnectivityBanner />
      <GithubUsernameBanner />
      <SlackNotificationBanner />
    </div>
  </header>
);
