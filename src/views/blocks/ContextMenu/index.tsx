import React, { CSSProperties } from "react";
import ContextMenuComponent from "./ContextMenuComponent";
import {
  ContextMenuPosition,
  ContextMenuPositionType,
  DEFAULT_MENU_WIDTH,
} from "../../../types/contextMenu";
import { useAppSelector } from "../../../hooks/store";
import { contextMenu, contextMenuClosedAt } from "../../../store/contextMenu";

type RelativePosition = {
  x: number;
  y: number;
  width: number;
};

const getRelativePosition = (
  position: ContextMenuPosition
): RelativePosition | undefined => {
  switch (position.type) {
    case ContextMenuPositionType.USER_BUTTON:
    default:
      const contentBlock = document.getElementById("control-bar__content");
      const userButtonBlock = document.getElementById(
        "control-bar__user-button"
      );
      if (!contentBlock || !userButtonBlock) {
        return undefined;
      }

      const rect = contentBlock.getBoundingClientRect();
      const userButtonRect = userButtonBlock.getBoundingClientRect();
      return {
        x: rect.left + (position.width || DEFAULT_MENU_WIDTH) - 8,
        y: userButtonRect.bottom + 8,
        width: position.width || DEFAULT_MENU_WIDTH,
      };
    case ContextMenuPositionType.POSITION:
      const pos = { x: 0, y: 0, width: DEFAULT_MENU_WIDTH, ...position };
      return {
        x: Math.min(pos.x + pos.width - 58, window.innerWidth - 18),
        y: pos.y,
        width: pos.width,
      };
  }
};

const getMenuStyle = (
  position: ContextMenuPosition
): CSSProperties | undefined => {
  if (position.type !== ContextMenuPositionType.CENTER) {
    const relativePosition = getRelativePosition(position);
    if (!relativePosition) {
      return undefined;
    }

    const baseStyle = {
      left: Math.max(0, relativePosition.x - relativePosition.width),
      top: relativePosition.y,
      width: relativePosition.width,
    };

    const contextMenu = document.getElementsByClassName(
      "context-menu__content"
    )[0];
    if (contextMenu) {
      return {
        ...baseStyle,
        top: Math.min(
          relativePosition.y,
          window.innerHeight - contextMenu.getBoundingClientRect().height - 8
        ),
      };
    } else {
      return baseStyle;
    }
  }

  return {
    width: position.width || DEFAULT_MENU_WIDTH,
  };
};

export default function ContextMenu() {
  const contextMenuData = useAppSelector(contextMenu);
  const closedAt = useAppSelector(contextMenuClosedAt);

  const menuStyle = React.useMemo<CSSProperties | undefined>(() => {
    if (contextMenuData && contextMenuData.position) {
      return getMenuStyle(contextMenuData.position);
    }
    return undefined;
  }, [contextMenuData]);

  if (!contextMenuData || !contextMenuData.position || closedAt) {
    return null;
  }
  return (
    <ContextMenuComponent contextMenu={contextMenuData} menuStyle={menuStyle} />
  );
}
