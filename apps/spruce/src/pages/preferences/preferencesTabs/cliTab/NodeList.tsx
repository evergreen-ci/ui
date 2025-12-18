import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { NodeType, Node } from "./nodeList/Node";

const { gray } = palette;
interface NodeListProps {
  list: NodeType[];
}
export const NodeList: React.FC<NodeListProps> = ({ list }) => (
  <NodeContainer>
    {list.map((node, index) => (
      <Node
        key={formatZeroIndexForDisplay(index)}
        child={node.child}
        stepNumber={formatZeroIndexForDisplay(index)}
        title={node.title}
      />
    ))}
  </NodeContainer>
);

const NodeContainer = styled.div`
  :last-child:after {
      background: ${gray.light2};
      content: "";
      left: 28px;
      position: absolute;
      top: 0%;
      height: 90%;
      width: 1px;

      /* Connecting line should appear under circles */
      z-index: -1;
    }
  }
`;
