import React from "react";
import { ReactComponent as IconArrowDown } from "../../../icons/arrow-down.svg";

import "./ExpandableContainer.scss";

export interface Props {
  title: string;
  children?: React.ReactNode;
  isExpandedByDefault?: boolean;
}

export default function ExpandableContainer({
  title,
  children,
  isExpandedByDefault = false,
}: Props) {
  const [isExpanded, setIsExpanded] =
    React.useState<boolean>(isExpandedByDefault);

  React.useEffect(() => {
    setIsExpanded(isExpandedByDefault);
  }, [isExpandedByDefault]);

  return (
    <div
      className={
        "expandable-container" +
        (isExpanded ? " expandable-container--expanded" : "")
      }
    >
      <div
        className="expandable-container__title"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="expandable-container__title-text">{title}</div>
        <div className="expandable-container__title-icon">
          <IconArrowDown />
        </div>
      </div>
      {isExpanded && (
        <div className="expandable-container__content">{children}</div>
      )}
    </div>
  );
}
