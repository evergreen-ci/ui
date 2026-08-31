import { Code, type CodeProps } from "@leafygreen-ui/code";

export type CodeViewerProps = Pick<
  CodeProps,
  "children" | "className" | "language"
> & {
  "data-testid"?: string;
};

/**
 * Bridge over the LeafyGreen code viewer. All call sites route through this
 * wrapper so the CodeEditor port (UXE-616) can swap the implementation in one
 * place. Only the props currently in use are exposed.
 * @param props - LeafyGreen Code props for the underlying viewer.
 * @returns The LeafyGreen Code component.
 */
export const CodeViewer: React.FC<CodeViewerProps> = (props) => (
  <Code {...props} />
);
