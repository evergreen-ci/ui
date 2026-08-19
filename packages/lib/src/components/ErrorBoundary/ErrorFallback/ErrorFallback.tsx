import { H1, H2 } from "@leafygreen-ui/typography";
import styles from "./ErrorFallback.module.css";
import errorPage from "./errorPage.svg";

interface ErrorFallbackProps {
  /** The URL to direct the user to if they encounter the error fallback */
  homeURL: string;
}
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ homeURL }) => (
  <div className={styles.center} data-testid="error-fallback">
    <div className={styles.text}>
      <H1 className={styles.header}>Error</H1>
      <H2 className={styles.subtitle}>
        Ouch! That&apos;s gotta hurt,
        <br /> sorry about that!
      </H2>
      <a className={styles.link} href={homeURL}>
        Back To Home
      </a>
    </div>
    <img alt="Error Background" src={errorPage} />
  </div>
);

export default ErrorFallback;
