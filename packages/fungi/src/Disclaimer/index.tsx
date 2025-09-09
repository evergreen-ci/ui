import { DisclaimerText } from "@lg-chat/chat-disclaimer";

export const Disclaimer = ({ children }: React.PropsWithChildren) => (
  <DisclaimerText title="Terms of Use">{children}</DisclaimerText>
);
