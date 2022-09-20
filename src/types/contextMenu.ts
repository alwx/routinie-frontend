export const DEFAULT_MENU_WIDTH = 400;

export type ContextMenu = {
  options?: (ContextMenuOption | null)[];
  // if the position is not explicitly specified, the previous one is going to be used
  position?: ContextMenuPosition;
  isBlockingView?: boolean;
  data?: StateMessage & any;
};

export type ContextMenuPosition = {
  type: ContextMenuPositionType;
  width?: number;
  x?: number;
  y?: number;
};

export type ContextMenuOption = {
  type?: ContextMenuType;
  data?: any;
};

export enum ContextMenuPositionType {
  CENTER,
  USER_BUTTON,
  POSITION,
}

export enum ContextMenuType {
  CLICKABLE,
  PROMPT,
  SIGN_UP,
  EMAIL_CONFIRMATION,
  SIGN_IN,
  REMIND_PASSWORD,
  SET_PASSWORD,
  CHANGE_PASSWORD,
  CHANGE_TEXT_FIELD,
  TRACKER_VALUE_CHOOSER,
}

export type StateMessage = {
  stateMessage?: string;
  stateMessageType?: StateMessageType;
};

export enum StateMessageType {
  ERROR = "error",
  INFO = "info",
}
