import { Link, Text, TextStyle } from "@via-ds/components/typography";
import styles from "./ErrorFallback.module.css";
import errorPage from "./errorPage.svg";

interface ErrorFallbackProps {
  /** The URL to direct the user to if they encounter the error fallback */
  homeURL: string;
}
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ homeURL }) => (
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

export default ErrorFallback;
