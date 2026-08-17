import styles from "./TableWrapper.module.css";

interface TableWrapperProps {
  children: React.ReactNode;
  controls?: React.ReactNode;
  shouldShowBottomTableControl?: boolean;
}
const TableWrapper: React.FC<TableWrapperProps> = ({
  children,
  controls,
  shouldShowBottomTableControl,
}) => (
  <>
    {controls}
    {children}
    {shouldShowBottomTableControl && (
      <div className={styles.tableControlWrapper}>{controls}</div>
    )}
  </>
);

export default TableWrapper;
