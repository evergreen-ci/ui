import styled from "@emotion/styled";

export const Subtitle = styled.h6`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0;
  margin: 0;
`;

export const H1 = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0;
  margin: 0;
`;

export const H2 = styled.h2`
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0;
  margin: 0;
`;

export const H3 = styled.h3`
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0;
  margin: 0;
`;

export const Body = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0;
  margin: 0;
`;

export const Disclaimer = styled.small`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0;
  margin: 0;
`;

export const Overline = styled.div`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  margin: 0;
`;

export type SubtitleProps = React.ComponentProps<typeof Subtitle>;
export type H1Props = React.ComponentProps<typeof H1>;
export type H2Props = React.ComponentProps<typeof H2>;
export type H3Props = React.ComponentProps<typeof H3>;
export type BodyProps = React.ComponentProps<typeof Body>;
export type DisclaimerProps = React.ComponentProps<typeof Disclaimer>;
export type OverlineProps = React.ComponentProps<typeof Overline>;
