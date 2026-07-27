import { Body } from "@leafygreen-ui/typography";

interface Props {
  numerator: number;
  denominator: number;
  dataCyNumerator?: string;
  dataCyDenominator?: string;
  dataTestIdNumerator?: string;
  dataTestIdDenominator?: string;
  label: string;
}
export const ResultCountLabel: React.FC<Props> = ({
  dataCyDenominator,
  dataCyNumerator,
  dataTestIdDenominator,
  dataTestIdNumerator,
  denominator,
  label,
  numerator,
}) => (
  <Body>
    <span data-cy={dataCyNumerator} data-testid={dataTestIdNumerator}>
      {numerator}
    </span>
    /
    <span data-cy={dataCyDenominator} data-testid={dataTestIdDenominator}>
      {denominator}
    </span>
    <span> {label}</span>
  </Body>
);
