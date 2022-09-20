import React from "react";
import { Button, TextInput } from "../../StyledControls";
import PromptStateMessage from "../common/PromptStateMessage";
import RichTitle from "../common/RichTitle";

export type SetPasswordData = {
  email?: string;
  action?: (email: string, code: string, password: string) => any;
  cancelAction?: () => any;
};

interface Props {
  optionData: SetPasswordData;
  contextMenuData?: any;
}

export default function SetPassword({ optionData, contextMenuData }: Props) {
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const codeRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);

  const [emailValue, setEmailValue] = React.useState(optionData.email || "");
  const [codeValue, setCodeValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");

  return (
    <div className="prompt">
      <RichTitle title="Set a new password" />
      <div className="prompt__text">
        We've sent you an e-mail with the confirmation code. Just enter this
        code and your new password here.
      </div>
      <PromptStateMessage stateMessage={contextMenuData} />
      <div className="prompt__custom-content">
        {!optionData.email && (
          <TextInput
            inputRef={emailRef}
            htmlId="email"
            label="E-mail:"
            defaultValue={emailValue}
            onChange={(e) => {
              setEmailValue(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setTimeout(() => codeRef?.current?.focus(), 50);
              }
            }}
          />
        )}
        <TextInput
          inputRef={codeRef}
          htmlId="code"
          label="Code:"
          defaultValue={codeValue}
          onChange={(e) => {
            setCodeValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setTimeout(() => codeRef?.current?.focus(), 50);
            }
          }}
        />
        <TextInput
          inputRef={passwordRef}
          htmlId="password"
          label="New password:"
          type="password"
          defaultValue={passwordValue}
          onChange={(e) => {
            setPasswordValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              optionData.action?.(emailValue, codeValue, passwordValue);
            }
          }}
        />
      </div>
      <div className="prompt__buttons">
        <Button
          onClick={() => {
            optionData.action?.(emailValue, codeValue, passwordValue);
          }}
        >
          Update password
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
