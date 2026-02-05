import styled from "@emotion/styled";
import { Button, Variant } from "@leafygreen-ui/button";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { useChatContext } from "../Context";
import { useAuthContext } from "./AuthProvider";

export const Login: React.FC = () => {
  const { appName } = useChatContext();
  const { beginPollingAuth, isPolling, loginUrl } = useAuthContext();

  const handleLoginClick = () => {
    beginPollingAuth();
    // Open window here instead of via href to avoid an LG race condition between href and an onClick that updates isLoading/disabled
    window.open(loginUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Container>
      <MessageText>{appName} requires separate authentication.</MessageText>
      <Button
        disabled={isPolling}
        onClick={handleLoginClick}
        variant={Variant.BaseGreen}
      >
        {isPolling ? "Waiting for login..." : "Log in"}
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${size.s};
`;

const MessageText = styled.div`
  font-size: ${fontSize.m};
`;
