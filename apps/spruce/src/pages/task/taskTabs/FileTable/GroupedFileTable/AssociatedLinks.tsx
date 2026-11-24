import { Button, ButtonVariant } from "@via-ds/components/button";
import { Content, Header } from "@via-ds/components/structure";
import { TableDetailsRenderProps } from "@via-ds/components/table";
import { Link, Text, TextStyle } from "@via-ds/components/typography";
import { isValidHttpOrT2Url, isValidHttpUrl } from "@evg-ui/lib/utils/url";
import styles from "./AssociatedLinks.module.css";
import { FileTableRow, GroupedFilesFile } from "./types";

export const processFilesWithAssociatedLinks = (
  files: GroupedFilesFile[],
): FileTableRow[] =>
  files.map((file) => ({
    associatedLinks:
      file.associatedLinks?.filter(({ link }) => isValidHttpOrT2Url(link)) ??
      [],
    name: file.name,
    link: isValidHttpUrl(file.link) ? file.link : null,
    urlParsley: isValidHttpUrl(file.urlParsley) ? file.urlParsley : null,
  }));

type AssociatedLinksProps = TableDetailsRenderProps<FileTableRow> & {
  onLinkPress: (fileName: string, linkName: string) => void;
};

export const AssociatedLinks: React.FC<AssociatedLinksProps> = ({
  clear,
  hiddenCount,
  onLinkPress,
  rows,
}) => (
  <>
    <Header>
      <Text slot="title">Associated Links</Text>
      <div className={styles.actions}>
        {hiddenCount > 0 && (
          <Text className={styles.secondary}>+{hiddenCount} not shown</Text>
        )}
        <Button onPress={clear} variant={ButtonVariant.Tertiary}>
          Clear
        </Button>
      </div>
    </Header>
    <Content isScrollable>
      {rows.length === 0 ? (
        <Text>
          No files selected. Use a file&apos;s details button to add one.
        </Text>
      ) : (
        <div className={styles.files} data-testid="associated-links-container">
          {rows.map((row) => (
            <section
              key={row.id}
              aria-label={row.original.name}
              className={styles.file}
            >
              <Text elementType="h3" textStyle={TextStyle.heading6}>
                {row.original.name}
              </Text>
              <ul className={styles.links}>
                {row.original.associatedLinks.map(({ link, name }) => (
                  <li key={link}>
                    <Link
                      data-testid="associated-link"
                      href={link}
                      onPress={() => onLinkPress(row.original.name, name)}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Content>
  </>
);
