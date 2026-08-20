import { Link, Text, TextStyle } from "@via-ds/components/typography";
import errorPage from "../../components/ErrorBoundary/ErrorFallback/errorPage.svg";
import styles from "./index.module.css";

interface ErrorFallbackProps {
  homeURL: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ homeURL }) => (
  <div className={styles.center} data-testid="error-fallback">
    <div className={styles.paragraph}>
      <Text className={styles.whiteText} textStyle={TextStyle.heading1}>
        Ouch! That&apos;s gotta hurt,
        <br /> sorry about that!
      </Text>
      <Text className={styles.whiteText} textStyle={TextStyle.body}>
        Something went wrong.
      </Text>
      <Link className={styles.whiteLink} href={homeURL}>
        Back To Home
      </Link>
    </div>
    <img alt="Error Background" src={errorPage} />
  </div>
);
