import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import ErrorFallback from "./ErrorFallback";

export default {
  component: ErrorFallback,
} satisfies CustomMeta<typeof ErrorFallback>;

export const DefaultError: CustomStoryObj<typeof ErrorFallback> = {
  render: () => (
    <div style={{ height: "100%", width: "100%" }}>
      <ErrorFallback />
    </div>
  ),
};
