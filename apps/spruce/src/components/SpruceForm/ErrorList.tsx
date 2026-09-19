import { Banner, Variant } from "@leafygreen-ui/banner";
import { ErrorListProps } from "@rjsf/utils";

export const ErrorList: React.FC<ErrorListProps> = ({ errors }) => (
  <Banner variant={Variant.Danger}>
    Fix the following errors:
    <ul>
      {errors.map((error) => (
        <li key={error.stack}>{error.stack}</li>
      ))}
    </ul>
  </Banner>
);
