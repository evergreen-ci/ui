import { Body } from "@leafygreen-ui/typography";

interface Props {
  numerator: number;
  denominator: number;
  dataTestIdNumerator?: string;
  dataTestIdDenominator?: string;
  label: string;
}
export const ResultCountLabel: React.FC<Props> = ({
  dataTestIdDenominator,
  dataTestIdNumerator,
  denominator,
  label,
  numerator,
}) => (
  <Body>
    <span data-testid={dataTestIdNumerator}>{numerator}</span>/
    <span data-testid={dataTestIdDenominator}>{denominator}</span>
    <span> {label}</span>
  </Body>
);
