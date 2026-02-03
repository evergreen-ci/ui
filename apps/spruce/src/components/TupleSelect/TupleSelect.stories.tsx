import { Disclaimer } from "@leafygreen-ui/typography";
import { action } from "storybook/actions";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";

import TupleSelect from ".";

export default {
  component: TupleSelect,
} satisfies CustomMeta<typeof TupleSelect>;

export const Default: CustomStoryObj<typeof TupleSelect> = {
  render: () => (
    <>
      <TupleSelect
        ariaLabel="Tuple Select"
        data-cy="tuple-select"
        id="tuple-select"
        label="Tuple Select"
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
