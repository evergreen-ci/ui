import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskAnalytics } from "analytics";
import { GroupedFilesFile, FileTableRow } from "./types";

export const processFiles = (
  files: GroupedFilesFile[],
  taskAnalytics: ReturnType<typeof useTaskAnalytics>,
): FileTableRow[] =>
  files.map((file) => {
    const baseRow: FileTableRow = {
      name: file.name,
      link: file.link,
      urlParsley: file.urlParsley ?? null,
    };

    if (file.associatedLinks && file.associatedLinks.length > 0) {
      return {
        ...baseRow,
        renderExpandedContent: () => (
          <AssociatedLinksContainer data-cy="associated-links-container">
            <Disclaimer>Associated Links</Disclaimer>
            <AssociatedLinksList>
              {file.associatedLinks.map((link) => (
                <AssociatedLinkItem key={link.link}>
                  <StyledLink
                    data-cy="associated-link"
                    href={link.link}
                    onClick={() => {
                      taskAnalytics.sendEvent({
                        name: "Clicked task file associated link",
                        "file.name": file.name,
                        "link.name": link.name,
                      });
                    }}
                  >
                    {link.name}
                  </StyledLink>
                </AssociatedLinkItem>
              ))}
            </AssociatedLinksList>
          </AssociatedLinksContainer>
        ),
      };
    }

    return baseRow;
  });

const AssociatedLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};

  padding-left: 52px;
`;

const AssociatedLinksList = styled.ol`
  margin: 0;
  padding: 0;
`;

const AssociatedLinkItem = styled.li`
  color: ${palette.gray.dark1};
  margin-bottom: ${size.xs};
  margin-left: ${size.s};
  padding-left: ${size.xxs};
`;
