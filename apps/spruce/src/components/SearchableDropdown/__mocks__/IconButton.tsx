import React from "react";

const IconButton = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
  <button ref={ref} type="button" {...props}>
    {props.children}
  </button>
));

IconButton.displayName = "IconButton";

export default IconButton;
