import { useState } from "react";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";

import PageSizeSelector from ".";

export default {
  component: PageSizeSelector,
} satisfies CustomMeta<typeof PageSizeSelector>;

export const Default: CustomStoryObj<typeof PageSizeSelector> = {
  render: () => <PageSize />,
};

const PageSize = () => {
  const [pageSize, setPageSize] = useState(10);
  return <PageSizeSelector onChange={setPageSize} value={pageSize} />;
};
