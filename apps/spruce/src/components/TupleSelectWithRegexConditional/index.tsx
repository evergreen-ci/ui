import { useState } from "react";
import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import TupleSelect from "components/TupleSelect";
import { size } from "constants/tokens";

interface TupleSelectWithRegexConditionalProps
  extends React.ComponentProps<typeof TupleSelect> {}

/**
 * TupleSelectWithRegexConditional is a wrapper around TupleSelect that allows the user to toggle between regex and exact match
 * @param props - TupleSelectWithRegexConditionalProps
 * @param props.onSubmit - callback function that is called when the user submits a new input
 * @param props.validator - function that is called to validate the value of the input
 * @returns The TupleSelectWithRegexConditional component
 */
const TupleSelectWithRegexConditional: React.FC<
  TupleSelectWithRegexConditionalProps
> = ({ onSubmit, validator, ...rest }) => {
  const [type, setType] = useState("regex");
  const isRegex = type === "regex";

  const handleOnSubmit = ({
    category,
    value,
  }: {
    category: string;
    value: string;
  }) => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    onSubmit({ category, value: isRegex ? value : escapeRegex(value) });
  };

  return (
    <TupleSelect
      {...rest}
      aria-label="tuple-select-with-regex"
      label={
        <>
          Add New Filter
          <PaddedSegmentedControl
            aria-controls="tuple-select-with-regex"
            onChange={setType}
            size="xsmall"
            value={type}
          >
            <SegmentedControlOption data-cy="tuple-select-regex" value="regex">
              REGEX
            </SegmentedControlOption>
            <SegmentedControlOption data-cy="tuple-select-exact" value="exact">
              EXACT
            </SegmentedControlOption>
          </PaddedSegmentedControl>
        </>
      }
      onSubmit={handleOnSubmit}
      validator={isRegex ? validator : () => true}
    />
  );
};

const PaddedSegmentedControl = styled(SegmentedControl)`
  margin-left: ${size.xs};
`;

const escapeRegex = (str: string) =>
  str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

export default TupleSelectWithRegexConditional;
