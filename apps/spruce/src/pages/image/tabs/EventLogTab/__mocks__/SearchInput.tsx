import { ReactNode, ChangeEvent } from "react";

interface SearchInputProps {
  children?: ReactNode;
  className?: string;
  "data-cy"?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  "aria-label"?: string;
  [key: string]: unknown;
}

export const SearchInput = ({
  children,
  className,
  "data-cy": dataCy,
  onChange,
  placeholder,
  value,
  ...props
}: SearchInputProps) => (
  <div className={className}>
    <input
      aria-label={props["aria-label"]}
      data-cy={dataCy}
      onChange={onChange}
      placeholder={placeholder}
      type="search"
      value={value}
    />
    {children}
  </div>
);
