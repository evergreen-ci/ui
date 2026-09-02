import {
  ChangeEvent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SearchInput } from "@leafygreen-ui/search-input";
import { cx } from "@evg-ui/lib/utils/css";
import Dropdown from "components/Dropdown";
import styles from "./index.module.css";

export interface SearchableDropdownProps<T> {
  buttonRenderer?: (option: T | T[]) => React.ReactNode;
  className?: string;
  ["data-testid"]?: string;
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
  buttonRenderer,
  className,
  "data-testid": dataTestId = "searchable-dropdown",
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
  const dropdownRef = useRef(null);

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
    onChange(v);
    if (dropdownRef.current) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      dropdownRef.current.setIsOpen(false);
    }
    resetSearch();
  };

  const option = optionRenderer
    ? // @ts-expect-error: FIXME. This comment was added by an automated script.
      (v: T) => optionRenderer(v, onClick)
    : (v: T) => (
        <SearchableDropdownOption
          key={`searchable_dropdown_option_${v}`}
          onClick={() => onClick(v)}
          value={v}
        />
      );

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
    <div className={cx(styles.container, className)}>
      {label && (
        <label
          className={styles.label}
          htmlFor={`searchable-dropdown-${label}`}
        >
          {label}
        </label>
      )}
      <div>
        <Dropdown
          ref={dropdownRef}
          aria-disabled={disabled}
          buttonRenderer={
            buttonRenderer ? () => buttonRenderer(value) : undefined
          }
          buttonText={buttonText}
          data-testid={dataTestId}
          disabled={disabled}
          id={`searchable-dropdown-${label}`}
          onClose={resetSearch}
          useHorizontalPadding={false}
        >
          <SearchInput
            aria-label="Search for options"
            aria-labelledby={label ? `searchable-dropdown-${label}` : undefined}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            className={styles.searchInput}
            data-testid={`${dataTestId}-search-input`}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
            value={search}
          />
          <div className={styles.scrollableList}>
            {/* eslint-disable-next-line react-hooks/refs -- pre-existing violation, surfaced by the Emotion conversion */}
            {(visibleOptions as T[])?.map((o) => option(o))}
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

interface SearchableDropdownOptionProps<T> {
  onClick: (v: T) => void;
  value: T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const SearchableDropdownOption = <T extends {}>({
  onClick,
  value,
}: PropsWithChildren<SearchableDropdownOptionProps<T>>) => (
  // eslint-disable-next-line react/button-has-type -- pre-existing violation, surfaced by the Emotion conversion
  <button
    key={`select_${value}`}
    className={styles.option}
    data-testid="searchable-dropdown-option"
    onClick={() => onClick(value)}
  >
    {value.toString()}
  </button>
);

export default SearchableDropdown;
