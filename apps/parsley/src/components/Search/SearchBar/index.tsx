import { KeyboardEvent, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Option, Select } from "@leafygreen-ui/select";
import Tooltip from "@leafygreen-ui/tooltip";
import { InlineKeyCode } from "@leafygreen-ui/typography";
import debounce from "lodash.debounce";
import Icon from "@evg-ui/lib/components/Icon";
import { TextInputWithGlyph } from "@evg-ui/lib/components/TextInputWithGlyph";
import { CharKey, ModifierKey } from "@evg-ui/lib/constants/keys";
import { size, textInputHeight, zIndex } from "@evg-ui/lib/constants/tokens";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { useLogWindowAnalytics } from "analytics";
import { SearchBarActions } from "constants/enums";
import { DIRECTION } from "context/LogContext/types";
import { useKeyboardShortcut } from "hooks";
import SearchPopover from "./SearchPopover";
import { SearchSuggestionGroup } from "./SearchPopover/types";

const { red } = palette;
interface SearchBarProps {
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (selected: string, value: string) => void;
  paginate?: (dir: DIRECTION) => void;
  searchSuggestions?: SearchSuggestionGroup[];
  validator?: (value: string) => boolean;
  validatorMessage?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  disabled = false,
  onChange = () => {},
  onSubmit = () => {},
  paginate = () => {},
  searchSuggestions = [],
  validator = () => true,
  validatorMessage = "Invalid input",
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [autoCompletePlaceholder, setAutoCompletePlaceholder] = useState("");
  const [selected, setSelected] = useState(SearchBarActions.Filter);

  const isValid = validator(input);
  const debounceSearch = useRef(
    debounce((value: string) => {
      onChange(value);
    }, 500),
  ).current;

  useKeyboardShortcut(
    { charKey: CharKey.F, modifierKeys: [ModifierKey.Control] },
    () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    },
    { disabled, ignoreFocus: true },
  );

  useKeyboardShortcut(
    { charKey: CharKey.S, modifierKeys: [ModifierKey.Control] },
    () => {
      // Iterate through SearchBarActions and select the next one.
      const SearchBarActionValues = Object.values(SearchBarActions);
      const keyIndex =
        (SearchBarActionValues.indexOf(selected) + 1) %
        SearchBarActionValues.length;
      const nextKey = Object.keys(SearchBarActions)[
        keyIndex
      ] as keyof typeof SearchBarActions;
      setSelected(SearchBarActions[nextKey]);
    },
    { disabled, ignoreFocus: true },
  );

  useEffect(() => {
    if (input.length === 0) {
      setAutoCompletePlaceholder("");
      return;
    }
    // Iterate through searchSuggestions and then the suggestions and return the first suggestion that starts with the input. suggestion should be a string representing the first suggestion in the suggestion group that matches
    let suggestion = "";
    for (const group of searchSuggestions) {
      for (const s of group.suggestions) {
        if (s.startsWith(input)) {
          suggestion = s;
          break;
        }
      }
    }

    if (suggestion && suggestion !== input) {
      setAutoCompletePlaceholder(suggestion);
    } else {
      setAutoCompletePlaceholder("");
    }
  }, [input, searchSuggestions]);

  const handleChangeSelect = (value: string) => {
    setSelected(value as SearchBarActions);
    leaveBreadcrumb("search-bar-select", { value }, SentryBreadcrumbTypes.User);
  };

  const handleOnSubmit = () => {
    debounceSearch.cancel(); // Cancel the debounce request to prevent delayed search.
    inputRef.current?.blur();
    setInput("");
    leaveBreadcrumb(
      "search-bar-submit",
      { input, selected },
      SentryBreadcrumbTypes.User,
    );
    onSubmit(selected, input);
  };

  const handleOnChange = (value: string) => {
    setInput(value);
    if (validator(value)) {
      debounceSearch(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If the user presses tab and there is a persistent placeholder, complete the suggestion
    if (e.key === CharKey.Tab && autoCompletePlaceholder.length > 0) {
      e.preventDefault();
      handleOnChange(autoCompletePlaceholder);
      setAutoCompletePlaceholder("");
      sendEvent({
        name: "Used search suggestion",
        suggestion: autoCompletePlaceholder,
        tab_complete: true,
      });
    }
    const commandKey = e.ctrlKey || e.metaKey;
    if (e.key === CharKey.Enter && commandKey && isValid) {
      handleOnSubmit();
    } else if (e.key === CharKey.Enter && e.shiftKey) {
      paginate(DIRECTION.PREVIOUS);
      sendEvent({
        direction: DIRECTION.PREVIOUS,
        name: "Used search result pagination",
      });
    } else if (e.key === CharKey.Enter) {
      paginate(DIRECTION.NEXT);
      sendEvent({
        direction: DIRECTION.NEXT,
        name: "Used search result pagination",
      });
    }
  };

  return (
    <Container className={className}>
      <StyledSelect
        allowDeselect={false}
        aria-labelledby="searchbar-select"
        data-cy="searchbar-select"
        disabled={disabled}
        onChange={handleChangeSelect}
        popoverZIndex={zIndex.popover}
        value={selected}
      >
        <Option
          key={SearchBarActions.Filter}
          data-cy="filter-option"
          value={SearchBarActions.Filter}
        >
          Filter
        </Option>
        <Option
          key={SearchBarActions.Highlight}
          data-cy="highlight-option"
          value={SearchBarActions.Highlight}
        >
          Highlight
        </Option>
      </StyledSelect>
      <InputWrapper>
        <IconButtonWrapper>
          <SearchPopover
            disabled={disabled}
            onClick={(suggestion) => {
              handleOnChange(suggestion);
              inputRef.current?.focus();
              sendEvent({
                name: "Used search suggestion",
                suggestion,
                tab_complete: false,
              });
              leaveBreadcrumb(
                "applied-search-suggestion",
                { suggestion },
                SentryBreadcrumbTypes.User,
              );
            }}
            searchSuggestions={searchSuggestions}
          />
        </IconButtonWrapper>
        <StyledInput
          ref={inputRef}
          aria-labelledby="searchbar-input"
          data-cy="searchbar-input"
          disabled={disabled}
          icon={
            isValid ? (
              <IconButton
                aria-label="Select plus"
                data-cy="searchbar-submit"
                disabled={disabled || input.length === 0}
                onClick={handleOnSubmit}
              >
                <Icon glyph="Plus" />
              </IconButton>
            ) : (
              <Tooltip
                justify="middle"
                trigger={
                  <div data-cy="searchbar-error">
                    <Icon fill={red.base} glyph="Warning" />
                  </div>
                }
                triggerEvent="hover"
              >
                {validatorMessage}
              </Tooltip>
            )
          }
          onChange={(e) => handleOnChange(e.target.value)}
          onKeyDown={handleKeyDown}
          persistentPlaceholder={
            autoCompletePlaceholder.length > 0 && (
              <PlaceholderWrapper>
                {autoCompletePlaceholder.length > 30
                  ? `${autoCompletePlaceholder.slice(0, 30)}…`
                  : autoCompletePlaceholder}
                <span>
                  <InlineKeyCode>Tab</InlineKeyCode> to complete
                </span>
              </PlaceholderWrapper>
            )
          }
          placeholder="optional, regexp to search"
          spellCheck={false}
          state={isValid ? "none" : "error"}
          type="text"
          value={input}
        />
      </InputWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PlaceholderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.m};
`;

const StyledSelect = styled(Select)`
  width: 120px;
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  button {
    margin-top: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled(TextInputWithGlyph)`
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  div > div {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }

  /* This reflect the side dropdown width */
  input[data-cy="searchbar-input"] {
    padding-left: 42px;
  }

  /* This reflects the side dropdown width */
  .persistent-placeholder {
    padding-left: 42px;
    left: 12px;
  }
  div[data-lgid="lg-form_field-feedback"] {
    display: none;
  }
  position: relative;
`;

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: 0;
  left: ${size.xxs};

  z-index: 1;
  width: ${size.l};
  height: ${textInputHeight};
`;

export default SearchBar;
