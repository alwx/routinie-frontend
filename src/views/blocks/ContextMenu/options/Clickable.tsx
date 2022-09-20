import React, { ReactNode } from "react";
import "./Clickable.scss";

export type ClickableData = {
  label?: string;
  description?: string;
  action?: () => any;
  icon?: ReactNode;
  isSelected?: boolean;
};

interface Props {
  optionData: ClickableData;
}

export default function Clickable({ optionData }: Props) {
  return (
    <div
      className={
        "clickable" + (optionData.isSelected ? " clickable--selected" : "")
      }
      onClick={(e) => {
        optionData.action?.();
      }}
    >
      <div className="clickable__label">
        <span>{optionData.label}</span>
        {optionData.icon && (
          <span className="clickable__label-icon">{optionData.icon}</span>
        )}
      </div>
      {optionData.description && (
        <div className="clickable__description">{optionData.description}</div>
      )}
    </div>
  );
}
