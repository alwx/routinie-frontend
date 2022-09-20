import React from "react";
import { Button, TextInput } from "../../StyledControls";
import PromptStateMessage from "../common/PromptStateMessage";
import RichTitle from "../common/RichTitle";

export type ChangePasswordData = {
  action?: (password: string, newPassword: string) => any;
  cancelAction?: () => any;
};

interface Props {
  optionData: ChangePasswordData;
  contextMenuData?: any;
}

export default function ChangePassword({ optionData, contextMenuData }: Props) {
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const newPasswordRef = React.useRef<HTMLInputElement | null>(null);

  const [passwordValue, setPasswordValue] = React.useState("");
  const [newPasswordValue, setNewPasswordValue] = React.useState("");

  React.useEffect(() => {
    setTimeout(() => passwordRef?.current?.focus(), 50);
  }, []);

  return (
    <div className="prompt">
      <RichTitle title="Change password" />
      <PromptStateMessage stateMessage={contextMenuData} />
      <div className="prompt__custom-content">
        <TextInput
          inputRef={passwordRef}
          htmlId="password"
          label="Old password:"
          type="password"
          defaultValue={passwordValue}
          onChange={(e) => {
            setPasswordValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setTimeout(() => newPasswordRef?.current?.focus(), 50);
            }
          }}
        />
        <TextInput
          inputRef={newPasswordRef}
          htmlId="new_password"
          label="New password:"
          type="password"
          defaultValue={newPasswordValue}
          onChange={(e) => {
            setNewPasswordValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              optionData.action?.(passwordValue, newPasswordValue);
            }
          }}
        />
      </div>
      <div className="prompt__buttons">
        <Button
          onClick={() => {
            optionData.action?.(passwordValue, newPasswordValue);
          }}
        >
          Update
        </Button>
        <Button
          onClick={() => {
            optionData.cancelAction?.();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
