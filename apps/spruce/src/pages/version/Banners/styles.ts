import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants";

const BannerContainer = styled.div`
  margin-bottom: ${size.s};
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;

const OrderedList = styled.ol`
  padding-inline-start: ${size.m};
`;

const ListItem = styled.li`
  margin-bottom: ${size.xs};
`;

const ModalTriggerText = styled.span`
  font-weight: bold;
  text-decoration-line: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 2px;
  :hover {
    cursor: pointer;
  }
`;

export {
  BannerContainer,
  TitleWrapper,
  OrderedList,
  ListItem,
  ModalTriggerText,
};
