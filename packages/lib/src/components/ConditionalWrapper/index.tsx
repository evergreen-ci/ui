interface ConditionalWrapperProps<T = React.ReactNode> {
  /** Whether or not to render the wrapper or the altWrapper if it is provided */
  condition: boolean;
  /** The wrapper to render around the children if the condition is true */
  wrapper: (children: T) => JSX.Element;
  /** The alternative wrapper to render around the children if the condition is false */
  altWrapper?: (children: T) => JSX.Element;
  children: T;
}
const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  altWrapper,
  children,
  condition,
  wrapper,
}) => {
  if (condition) {
    return wrapper(children);
  }
  return altWrapper ? altWrapper(children) : children;
};

export default ConditionalWrapper;
