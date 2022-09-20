import React, { CSSProperties } from "react";

import { closeContextMenu } from "../../../store/contextMenu";
import { useAppDispatch } from "../../../hooks/store";
import {
  ContextMenu,
  ContextMenuOption,
  ContextMenuPositionType,
  ContextMenuType,
} from "../../../types/contextMenu";

import Clickable, { ClickableData } from "./options/Clickable";
import Prompt, { PromptData } from "./options/Prompt";
import SignUp, { SignUpData } from "./options/SignUp";
import EmailConfirmation, {
  EmailConfirmationData,
} from "./options/EmailConfirmation";
import SignIn, { SignInData } from "./options/SignIn";
import RemindPassword, { RemindPasswordData } from "./options/RemindPassword";
import SetPassword, { SetPasswordData } from "./options/SetPassword";
import ChangeTextField, {
  ChangeTextFieldData,
} from "./options/ChangeTextField";
import ChangePassword, { ChangePasswordData } from "./options/ChangePassword";
import TrackerValueChooser, {
  TrackerValueChooserData,
} from "./options/TrackerValueChooser";

import "./ContextMenu.scss";
import "./Prompt.scss";

interface Props {
  contextMenu: ContextMenu;
  menuStyle?: CSSProperties;
}

function getOptionComponent(
  index: number,
  option: ContextMenuOption,
  contextMenuData?: any
): React.ReactNode {
  const k = "option_" + index;

  switch (option.type) {
    case ContextMenuType.CLICKABLE:
    default:
      return <Clickable key={k} optionData={option.data as ClickableData} />;
    case ContextMenuType.PROMPT:
      return <Prompt key={k} optionData={option.data as PromptData} />;
    case ContextMenuType.SIGN_UP:
      return (
        <SignUp
          key={k}
          optionData={option.data as SignUpData}
          contextMenuData={contextMenuData}
        />
      );
    case ContextMenuType.EMAIL_CONFIRMATION:
      return (
        <EmailConfirmation
          key={k}
          optionData={option.data as EmailConfirmationData}
          contextMenuData={contextMenuData}
        />
      );
    case ContextMenuType.SIGN_IN:
      return (
        <SignIn
          key={k}
          optionData={option.data as SignInData}
          contextMenuData={contextMenuData}
        />
      );
    case ContextMenuType.REMIND_PASSWORD:
      return (
        <RemindPassword
          key={k}
          optionData={option.data as RemindPasswordData}
          contextMenuData={contextMenuData}
        />
      );
    case ContextMenuType.SET_PASSWORD:
      return (
        <SetPassword
          key={k}
          optionData={option.data as SetPasswordData}
          contextMenuData={contextMenuData}
        />
      );
    case ContextMenuType.CHANGE_PASSWORD:
      return (
        <ChangePassword
          key={k}
          optionData={option.data as ChangePasswordData}
          contextMenuData={contextMenuData}
        />
      );
    case ContextMenuType.CHANGE_TEXT_FIELD:
      return (
        <ChangeTextField
          key={k}
          optionData={option.data as ChangeTextFieldData}
          contextMenuData={contextMenuData}
        />
      );
    case ContextMenuType.TRACKER_VALUE_CHOOSER:
      return (
        <TrackerValueChooser
          key={k}
          optionData={option.data as TrackerValueChooserData}
        />
      );
  }
}

export default function ContextMenuComponent({
  contextMenu,
  menuStyle,
}: Props) {
  const dispatch = useAppDispatch();

  const menuContainerClassName = React.useMemo(() => {
    return (
      "context-menu__container" +
      (contextMenu.position?.type === ContextMenuPositionType.CENTER
        ? " context-menu__container--centered"
        : "")
    );
  }, [contextMenu]);

  const menuClassName = React.useMemo(() => {
    return (
      "context-menu__block" +
      (contextMenu.position?.type === ContextMenuPositionType.CENTER
        ? " context-menu__block--centered"
        : "")
    );
  }, [contextMenu]);

  return (
    <div
      className={menuContainerClassName}
      onClick={() => {
        if (!contextMenu.isBlockingView) {
          dispatch(closeContextMenu());
        }
      }}
    >
      <div
        className={menuClassName}
        style={menuStyle}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="context-menu__content">
          {contextMenu.options
            ?.filter((option) => option != null)
            .map((option, index) => {
              if (option === null) {
                return null;
              }
              return getOptionComponent(index, option, contextMenu.data);
            })}
        </div>
      </div>
    </div>
  );
}
