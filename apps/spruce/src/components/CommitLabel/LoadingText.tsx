import { Skeleton, Text } from "@via-ds/components";
import styles from "./LoadingText.module.css";

interface LoadingTextProps {
  placeholder: string;
}

export const LoadingText: React.FC<LoadingTextProps> = ({ placeholder }) => (
  <Skeleton isLoading>
    <Text className={styles.text} elementType="span">
      {placeholder}
    </Text>
  </Skeleton>
);
