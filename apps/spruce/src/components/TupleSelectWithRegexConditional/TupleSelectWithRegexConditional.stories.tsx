import { Disclaimer } from "@leafygreen-ui/typography";
import { action } from "@storybook/addon-actions";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";

import TupleSelectWithRegexConditional from ".";

export default {
  title: "Components/TupleSelect",
  component: TupleSelectWithRegexConditional,
} satisfies CustomMeta<typeof TupleSelectWithRegexConditional>;

export const WithConditional: CustomStoryObj<
  typeof TupleSelectWithRegexConditional
> = {
  render: () => (
    <>
      <TupleSelectWithRegexConditional
        onSubmit={action("submit")}
        options={options}
        validator={(v) => v !== "bad"}
        validatorErrorMessage="Invalid Input"
      />
      <Disclaimer>The word `bad` will fail validation</Disclaimer>
    </>
  ),
};

const options = [
  {
    value: "build_variant",
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: "task",
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];
