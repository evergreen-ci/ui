import { Body } from "@leafygreen-ui/typography";

interface Props {
  numerator: number;
  denominator: number;
  dataCyNumerator?: string;
  dataCyDenominator?: string;
  label: string;
}
export const ResultCountLabel: React.FC<Props> = ({
  dataCyDenominator,
  dataCyNumerator,
  denominator,
  label,
  numerator,
}) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: FIXME. This component is throwing an invalid type
  <Body>
    <span data-cy={dataCyNumerator}>{numerator}</span>/
    <span data-cy={dataCyDenominator}>{denominator}</span>
    <span> {label}</span>
  </Body>
);
