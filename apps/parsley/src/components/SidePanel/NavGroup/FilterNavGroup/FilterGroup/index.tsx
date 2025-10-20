import { MouseEvent, useId, useMemo, useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import {
  SegmentedControlOption as Option,
  SegmentedControl,
} from "@leafygreen-ui/segmented-control";
import TextInput from "@leafygreen-ui/text-input";
import Toggle from "@leafygreen-ui/toggle";
import { Body, BodyProps, Error } from "@leafygreen-ui/typography";
import Accordion, {
  AccordionCaretAlign,
} from "@evg-ui/lib/components/Accordion";
import Icon from "@evg-ui/lib/components/Icon";
import IconWithTooltip from "@evg-ui/lib/components/IconWithTooltip";
import { size } from "@evg-ui/lib/constants/tokens";
import { useLogWindowAnalytics } from "analytics";
import { CaseSensitivity, MatchType } from "constants/enums";
import { Filter } from "types/logs";
import { getRegexpError, validateRegexp } from "utils/validators";

const { gray, red } = palette;

interface FilterGroupProps {
  filter: Filter;
  deleteFilter: (filter: string) => void;
  editFilter: (
    fieldName: keyof Filter,
    fieldValue: MatchType | CaseSensitivity | boolean | string,
    filter: Filter,
  ) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  deleteFilter,
  editFilter,
  filter,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { caseSensitive, expression, matchType, visible } = filter;

  const [newFilterExpression, setNewFilterExpression] = useState(expression);
  const [isEditing, setIsEditing] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(true);
  const id = useId();

  const isValid = useMemo(
    () => (expression ? validateRegexp(expression) : true),
    [expression],
  );

  const isNewExpressionValid =
    validateRegexp(newFilterExpression) && newFilterExpression !== "";

  const resetEditState = () => {
    setIsEditing(false);
    setNewFilterExpression(expression);
  };

  const handleSubmit = () => {
    if (isNewExpressionValid) {
      editFilter("expression", newFilterExpression, filter);
      resetEditState();
    }
  };

  const showTooltip = !isValid && !isEditing;
  const validationMessage =
    newFilterExpression === ""
      ? "Filter cannot be empty"
      : `Invalid Regular Expression: ${getRegexpError(newFilterExpression)}`;

  return (
    <Accordion
      caretAlign={AccordionCaretAlign.Start}
      defaultOpen
      onToggle={({ isVisible }) => {
        sendEvent({ active: isVisible, name: "Toggled filter active state" });
        setOpenAccordion(isVisible);
        if (isEditing) {
          resetEditState();
        }
      }}
      open={openAccordion}
      title={
        <>
          {showTooltip && (
            <IconWithTooltip color={red.base} glyph="ImportantWithCircle">
              Invalid filter expression, please update it!
              <Error>{validationMessage}</Error>
            </IconWithTooltip>
          )}
          <FilterExpression
            aria-expanded={openAccordion}
            expanded={openAccordion}
            id={id}
          >
            {expression}
          </FilterExpression>
          <IconButtonContainer>
            <Toggle
              aria-label={visible ? "Hide filter" : "Show filter"}
              aria-labelledby={id}
              checked={visible}
              disabled={!isValid}
              onChange={() => editFilter("visible", !visible, filter)}
              onClick={(e) => e.stopPropagation()}
              size="xsmall"
              title={visible ? "Hide filter" : "Show filter"}
            />
            <IconButton
              aria-label="Edit filter"
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                if (isEditing) {
                  resetEditState();
                } else {
                  setIsEditing(true);
                }
                setOpenAccordion(true);
              }}
              title="Edit filter"
            >
              <Icon fill={gray.base} glyph="Edit" />
            </IconButton>
            <IconButton
              aria-label="Delete filter"
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                deleteFilter(expression);
              }}
              title="Delete filter"
            >
              <Icon fill={gray.base} glyph="X" />
            </IconButton>
          </IconButtonContainer>
        </>
      }
      titleTag={AccordionTitle}
    >
      <AccordionContent>
        {isEditing && (
          <>
            <StyledTextInput
              aria-label="Edit filter name"
              aria-labelledby="Edit filter name"
              autoFocus
              data-cy="edit-filter-name"
              errorMessage={isNewExpressionValid ? "" : validationMessage}
              onChange={(e) => {
                setNewFilterExpression(e.target.value);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && isNewExpressionValid && handleSubmit()
              }
              placeholder="New filter definition"
              sizeVariant="small"
              spellCheck={false}
              state={isNewExpressionValid ? "none" : "error"}
              type="text"
              value={newFilterExpression}
            />
            <ButtonWrapper>
              <Button onClick={() => resetEditState()} size="xsmall">
                Cancel
              </Button>
              <Button
                disabled={!isNewExpressionValid}
                onClick={handleSubmit}
                size="xsmall"
                variant={Variant.PrimaryOutline}
              >
                Apply
              </Button>
            </ButtonWrapper>
          </>
        )}
        <StyledSegmentedControl
          aria-controls="Toggle case sensitivity"
          defaultValue={caseSensitive}
          label="Case"
          onChange={(value) =>
            editFilter("caseSensitive", value as CaseSensitivity, filter)
          }
          size="xsmall"
        >
          <Option disabled={!isValid} value={CaseSensitivity.Insensitive}>
            Insensitive
          </Option>
          <Option disabled={!isValid} value={CaseSensitivity.Sensitive}>
            Sensitive
          </Option>
        </StyledSegmentedControl>

        <StyledSegmentedControl
          aria-controls="Toggle match type"
          defaultValue={matchType}
          label="Match"
          onChange={(value) =>
            editFilter("matchType", value as MatchType, filter)
          }
          size="xsmall"
        >
          <Option disabled={!isValid} value={MatchType.Exact}>
            Exact
          </Option>
          <Option disabled={!isValid} value={MatchType.Inverse}>
            Inverse
          </Option>
        </StyledSegmentedControl>
      </AccordionContent>
    </Accordion>
  );
};

const AccordionTitle = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xxs};
  overflow: hidden;
`;

const AccordionContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${size.xs};
  padding-right: ${size.xxs};
`;

const FilterExpression = styled(Body)<{ expanded: boolean } & BodyProps>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ expanded }) => (expanded ? "unset" : 1)};
  overflow: hidden;
  font-weight: medium;
  margin-top: ${size.xxs};
`;

const IconButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTextInput = styled(TextInput)`
  margin-top: ${size.xxs};
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${size.xxs};
  margin-top: ${size.xs};
`;

const StyledSegmentedControl = styled(SegmentedControl)`
  margin-top: ${size.xs};
  // Set the labels to have the same width so that the controls are aligned.
  > div:first-of-type {
    width: 44px;
  }
`;

export default FilterGroup;
