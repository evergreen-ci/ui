import { Banner, Variant } from "@leafygreen-ui/banner";
import { ErrorListProps } from "@rjsf/core";

export const ErrorList: React.FC<ErrorListProps> = ({ errors }) => (
  <Banner variant={Variant.Danger}>
    <ul>
      {errors.map((error) => (
        <li key={error.stack}>{error.stack}</li>
      ))}
    </ul>
  </Banner>
);
