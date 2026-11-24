import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemPanel,
  AccordionItemTrigger,
} from "@via-ds/components/accordion";
import { BottomPanelCloseButton } from "@via-ds/components/bottom-panel";
import { Content, Header } from "@via-ds/components/structure";
import {
  type TableDetailsRenderProps,
  type ViaRowData,
} from "@via-ds/components/table";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@via-ds/components/tabs";
import { ToggleButton } from "@via-ds/components/toggle-button";
import { Text, TextStyle } from "@via-ds/components/typography";
import SplitHorizontal from "@via-ds/icons/SplitHorizontal";
import SplitVertical from "@via-ds/icons/SplitVertical";
import Table from "@via-ds/icons/Table";
import styles from "./DetailsPanel.module.css";

type Layout = "accordion" | "side-by-side" | "tabs";

type DetailsPanelProps<T extends ViaRowData> = TableDetailsRenderProps<T> & {
  getName: (row: T) => string;
  noun: string;
  renderRow: (row: T) => React.ReactNode;
};

export const DetailsPanel = <T extends ViaRowData>({
  clear,
  currentRowId,
  getName,
  hiddenCount,
  noun,
  renderRow,
  rows,
  setCurrentRow,
}: DetailsPanelProps<T>) => {
  const [layout, setLayout] = useState<Layout>("side-by-side");

  useEffect(() => {
    if (layout === "side-by-side" && currentRowId !== null) {
      setCurrentRow(null);
    }
  }, [layout, currentRowId, setCurrentRow]);

  const shownRowId =
    rows.find(({ id }) => id === currentRowId)?.id ?? rows[0]?.id;

  return (
    <>
      <Header>
        <Text slot="title">
          {rows.length} {rows.length === 1 ? noun : `${noun}s`} selected
        </Text>
        <div className={styles.actions}>
          {hiddenCount > 0 && (
            <Text className={styles.hiddenCount}>+{hiddenCount} not shown</Text>
          )}
          <ToggleButton
            aria-label="Accordion layout"
            isSelected={layout === "accordion"}
            onPress={() => setLayout("accordion")}
          >
            <SplitHorizontal slot="icon" />
          </ToggleButton>
          <ToggleButton
            aria-label="Side by side layout"
            isSelected={layout === "side-by-side"}
            onPress={() => setLayout("side-by-side")}
          >
            <SplitVertical slot="icon" />
          </ToggleButton>
          <ToggleButton
            aria-label="Tabs layout"
            isSelected={layout === "tabs"}
            onPress={() => {
              setLayout("tabs");
              if (shownRowId !== undefined) setCurrentRow(shownRowId);
            }}
          >
            <Table slot="icon" />
          </ToggleButton>
          <BottomPanelCloseButton aria-label="Close details" onPress={clear} />
        </div>
      </Header>
      <Content isScrollable>
        {rows.length === 0 ? (
          <Text>
            No {noun}s selected. Use a row&apos;s details button to add one.
          </Text>
        ) : (
          <>
            {layout === "side-by-side" && (
              <div className={styles.sideBySide}>
                {rows.map(({ id, original }) => (
                  <section
                    key={id}
                    aria-label={getName(original)}
                    className={styles.section}
                  >
                    <Text elementType="h3" textStyle={TextStyle.heading5}>
                      {getName(original)}
                    </Text>
                    {renderRow(original)}
                  </section>
                ))}
              </div>
            )}
            {layout === "accordion" && (
              <Accordion
                expandedKeys={currentRowId === null ? [] : [currentRowId]}
                onExpandedChange={(keys) => {
                  const [key] = keys;
                  setCurrentRow(key === undefined ? null : String(key));
                }}
              >
                {rows.map(({ id, original }) => (
                  <AccordionItem key={id} id={id}>
                    <AccordionItemHeader>
                      <AccordionItemTrigger>
                        <Text>{getName(original)}</Text>
                      </AccordionItemTrigger>
                    </AccordionItemHeader>
                    <AccordionItemPanel>
                      {renderRow(original)}
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {layout === "tabs" && (
              <Tabs
                onSelectionChange={(key) => setCurrentRow(String(key))}
                selectedKey={shownRowId}
              >
                <TabList aria-label={`Open ${noun}s`}>
                  {rows.map(({ id, original }) => (
                    <Tab key={id}>{getName(original)}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {rows.map(({ id, original }) => (
                    <TabPanel key={id}>
                      <div className={styles.tabPanel}>
                        {renderRow(original)}
                      </div>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            )}
          </>
        )}
      </Content>
    </>
  );
};
