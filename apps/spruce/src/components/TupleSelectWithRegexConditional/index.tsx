import { useState } from "react";
import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { size } from "@evg-ui/lib/constants";
import { toEscapedRegex } from "@evg-ui/lib/utils";
import TupleSelect from "components/TupleSelect";

export enum FilterType {
  Regex = "regex",
  Exact = "exact",
}

type TupleSelectWithRegexConditionalProps = Omit<
  React.ComponentProps<typeof TupleSelect>,
  "onSubmit"
> & {
  onSubmit: ({
    category,
    type,
    value,
  }: {
    category: string;
    value: string;
    type: FilterType;
  }) => void;
};

/**
 * TupleSelectWithRegexConditional is a wrapper around TupleSelect that allows the user to toggle between regex and exact match
 * @param props - TupleSelectWithRegexConditionalProps
 * @param props.onSubmit - callback function that is called when the user submits a new input
 * @param props.label - label for the input
 * @param props.validator - function that is called to validate the value of the input
 * @returns The TupleSelectWithRegexConditional component
 */
const TupleSelectWithRegexConditional: React.FC<
  TupleSelectWithRegexConditionalProps
> = ({ label, onSubmit, validator, ...rest }) => {
  const [type, setType] = useState(FilterType.Regex);
  const isRegex = type === FilterType.Regex;

  const handleOnSubmit = ({
    category,
    value,
  }: {
    category: string;
    value: string;
  }) => {
    onSubmit({
      category,
      value: isRegex ? value : toEscapedRegex(value),
      type,
    });
  };

  return (
    <TupleSelect
      {...rest}
      aria-label="tuple-select-with-regex"
      label={
        <>
          {label}
          <PaddedSegmentedControl
            aria-controls="tuple-select-with-regex"
            onChange={(t) => setType(t as FilterType)}
            size="xsmall"
            value={type}
          >
            <SegmentedControlOption
              data-cy="tuple-select-regex"
              value={FilterType.Regex}
            >
              Regex
            </SegmentedControlOption>
            <SegmentedControlOption
              data-cy="tuple-select-exact"
              value={FilterType.Exact}
            >
              Exact
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

export default TupleSelectWithRegexConditional;
