import React from "react";

import "./Button.scss";

interface Props {
  theme?: string;
  isDisabled?: boolean;
  onClick?: () => any;
  children?: React.ReactNode;
}

export default function Button({
  theme,
  isDisabled,
  onClick,
  children,
}: Props) {
  const className = React.useMemo(() => {
    return (
      "button" +
      (theme ? " button--" + theme : " button--default") +
      (isDisabled ? " button--disabled" : "")
    );
  }, [theme, isDisabled]);

  return (
    <button className={className} disabled={isDisabled} onClick={onClick}>
      {children}
    </button>
  );
}
