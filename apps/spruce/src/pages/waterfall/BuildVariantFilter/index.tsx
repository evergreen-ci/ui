import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { Label } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { useWaterfallAnalytics } from "analytics";
import TextInputWithValidation from "components/TextInputWithValidation";
import { FilterType } from "components/TupleSelectWithRegexConditional";
import { useUpsertQueryParams } from "hooks";
import { validators } from "utils";
import { WaterfallFilterOptions } from "../types";

export const BuildVariantFilter = () => {
  const onSubmit = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const [type, setType] = useState(FilterType.Regex);
  const isRegex = type === FilterType.Regex;

  const onSubmitTupleSelect = useCallback(
    (value: string) => {
      onSubmit({
        category: WaterfallFilterOptions.BuildVariant,
        value: isRegex ? value : toEscapedRegex(value),
      });
      sendEvent({ name: "Filtered by build variant", "filter.type": type });
    },
    [onSubmit, sendEvent, isRegex, type],
  );

  return (
    <Container>
      <Label htmlFor="build-variant-filter-input">
        <LabelContainer>
          <span>Build Variant</span>
          <SegmentedControl
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
          </SegmentedControl>
        </LabelContainer>
      </Label>
      <TextInputWithValidation
        aria-label="Build Variant Filter Input"
        clearOnSubmit
        data-cy="build-variant-filter"
        id="build-variant-filter-input"
        onSubmit={(val) => onSubmitTupleSelect(val)}
        placeholder="Build Variant Name"
        type="text"
        validator={validators.validateRegexp}
        validatorErrorMessage="Invalid regular expression"
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${size.xxs};
  align-items: center;
`;
