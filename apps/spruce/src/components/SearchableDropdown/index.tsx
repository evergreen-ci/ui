import {
  ChangeEvent,
  useState,
  PropsWithChildren,
  useRef,
  useEffect,
  useMemo,
} from "react";
import styled from "@emotion/styled";
import { css } from "@leafygreen-ui/emotion";
import { palette } from "@leafygreen-ui/palette";
import { SearchInput } from "@leafygreen-ui/search-input";

import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import Dropdown from "components/Dropdown";
import { toggleArray } from "utils/array";

const { blue, gray } = palette;

export interface SearchableDropdownProps<T> {
  allowMultiSelect?: boolean;
  buttonRenderer?: (option: T | T[]) => React.ReactNode;
  className?: string;
  ["data-cy"]?: string;
  disabled?: boolean;
  label?: React.ReactNode;
  onChange: (value: T | T[]) => void;
  options?: T[] | string[];
  optionRenderer?: (
    option: T,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    onClick: (selectedV) => void,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    isChecked: (selectedV) => boolean,
  ) => React.ReactNode;
  searchFunc?: (options: T[], match: string) => T[];
  searchPlaceholder?: string;
  value: T | T[];
  valuePlaceholder?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const SearchableDropdown = <T extends {}>({
  allowMultiSelect = false,
  buttonRenderer,
  className,
  "data-cy": dataCy = "searchable-dropdown",
  disabled = false,
  label,
  onChange,
  optionRenderer,
  options,
  searchFunc,
  searchPlaceholder = "search...",
  value,
  valuePlaceholder = "Select an element",
}: PropsWithChildren<SearchableDropdownProps<T>>) => {
  const [search, setSearch] = useState("");
  const [visibleOptions, setVisibleOptions] = useState(options ?? []);
  const DropdownRef = useRef(null);

  // Sometimes options come from a query and we have to wait for the query to complete to know what to show in
  // the dropdown. This hook is used to refresh the options.
  useEffect(() => {
    setVisibleOptions(options ?? []);
  }, [options]);

  // Clear search text input and reset visible options to show every option.
  const resetSearch = () => {
    setSearch("");
    setVisibleOptions(options ?? []);
  };

  const onClick = (v: T) => {
    if (allowMultiSelect) {
      if (Array.isArray(value)) {
        const newValue = toggleArray(v, value);
        onChange(newValue);
      } else {
        onChange([v]);
      }
    } else {
      onChange(v);
    }
    // Close the dropdown after user makes a selection only if it isn't a multiselect
    if (!allowMultiSelect) {
      if (DropdownRef.current) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        DropdownRef.current.setIsOpen(false);
      }
      resetSearch();
    }
  };

  const option = optionRenderer
    ? // @ts-expect-error: FIXME. This comment was added by an automated script.
      (v: T) => optionRenderer(v, onClick, isChecked)
    : (v: T) => (
        <SearchableDropdownOption
          key={`searchable_dropdown_option_${v}`}
          isChecked={isChecked(v)}
          onClick={() => onClick(v)}
          showCheckmark={allowMultiSelect}
          value={v}
        />
      );

  const isChecked = (elementValue: T) => {
    if (typeof value === "string") {
      return value === elementValue;
    }
    if (Array.isArray(value)) {
      // v is included in value
      return value.filter((v) => v === elementValue).length > 0;
    }
  };

  const handleSearch = useMemo(
    () => (e: ChangeEvent<HTMLInputElement>) => {
      const { value: searchTerm } = e.target;
      setSearch(searchTerm);
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      let filteredOptions = [];

      if (options) {
        if (searchFunc) {
          // Alias the array as any to avoid TS error https://github.com/microsoft/TypeScript/issues/36390
          filteredOptions = searchFunc(options as T[], searchTerm);
        } else if (typeof options[0] === "string") {
          filteredOptions = (options as string[]).filter(
            (o) => o.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1,
          );
        } else {
          console.error(
            "A searchFunc must be supplied when options is not of type string[]",
          );
        }
      }

      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setVisibleOptions(filteredOptions);
    },
    [searchFunc, options],
  );

  let buttonText = valuePlaceholder;
  if (value) {
    if (typeof value === "string" && value.length !== 0) {
      buttonText = value;
    } else if (Array.isArray(value) && value.length !== 0) {
      buttonText = value.join(", ");
    }
  }

  return (
    <Container className={className}>
      {label && (
        <StyledLabel htmlFor={`searchable-dropdown-${label}`}>
          {label}
        </StyledLabel>
      )}
      <Wrapper>
        <Dropdown
          ref={DropdownRef}
          aria-disabled={disabled}
          buttonRenderer={
            buttonRenderer ? () => buttonRenderer(value) : undefined
          }
          buttonText={buttonText}
          data-cy={dataCy}
          disabled={disabled}
          id={`searchable-dropdown-${label}`}
          onClose={resetSearch}
          useHorizontalPadding={false}
        >
          <SearchInput
            aria-label="Search for options"
            aria-labelledby={label ? `searchable-dropdown-${label}` : undefined}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            className={css`
              padding: 0 ${size.xs};
            `}
            data-cy={`${dataCy}-search-input`}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
            value={search}
          />
          <ScrollableList>
            {(visibleOptions as T[])?.map((o) => option(o))}
          </ScrollableList>
        </Dropdown>
      </Wrapper>
    </Container>
  );
};

interface SearchableDropdownOptionProps<T> {
  isChecked?: boolean;
  onClick: (v: T) => void;
  showCheckmark?: boolean;
  value: T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const SearchableDropdownOption = <T extends {}>({
  isChecked,
  onClick,
  showCheckmark,
  value,
}: PropsWithChildren<SearchableDropdownOptionProps<T>>) => (
  <Option
    key={`select_${value}`}
    data-cy="searchable-dropdown-option"
    onClick={() => onClick(value)}
  >
    {showCheckmark && (
      <CheckmarkContainer data-cy="checkmark">
        <CheckmarkIcon
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          checked={isChecked}
          fill={blue.base}
          glyph="Checkmark"
          height={12}
          width={12}
        />
      </CheckmarkContainer>
    )}
    {value.toString()}
  </Option>
);

const ScrollableList = styled.div`
  margin-top: ${size.xxs};
  overflow: scroll;
  max-height: 400px;
`;

const Wrapper = styled.div`
  width: ${(props: { width?: string }): string =>
    props.width ? props.width : ""};
`;

const Option = styled.button`
  // Remove native button styles.
  border: 0;
  background: none;
  text-align: inherit;
  font: inherit;

  width: 100%;
  word-break: break-word; // Safari
  overflow-wrap: anywhere;
  cursor: pointer;
  padding: ${size.xs} ${size.xs};
  :hover,
  :focus {
    outline: none;
    background-color: ${gray.light2};
  }
`;

const CheckmarkContainer = styled.div`
  margin-right: ${size.xxs};
`;

const CheckmarkIcon = styled(Icon)<{ checked: boolean }>`
  visibility: ${({ checked }) => (checked ? "visible" : "hidden")};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${gray.dark3};
  margin-bottom: ${size.xxs};
`;

export default SearchableDropdown;
