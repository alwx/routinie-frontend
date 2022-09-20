import React from "react";
import { Button, TextInput } from "../../StyledControls";
import PromptStateMessage from "../common/PromptStateMessage";
import RichTitle from "../common/RichTitle";

export type EmailConfirmationData = {
  text?: string;
  action?: (code: string) => any;
  resendAction?: () => any;
};

interface Props {
  optionData: EmailConfirmationData;
  contextMenuData?: any;
}

export default function EmailConfirmation({
  optionData,
  contextMenuData,
}: Props) {
  const codeRef = React.useRef<HTMLInputElement | null>(null);
  const [codeValue, setCodeValue] = React.useState("");

  return (
    <div className="prompt">
      <RichTitle title="Confirm your e-mail" />
      <div className="prompt__text">
        Please, enter the confirmation code that was sent to you to confirm your
        e-mail address.
      </div>
      <PromptStateMessage stateMessage={contextMenuData} />
      <div className="prompt__custom-content">
        <TextInput
          inputRef={codeRef}
          htmlId="confirmation_code"
          label="Confirmation code:"
          onChange={(e) => {
            setCodeValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              optionData.action?.(codeValue);
            }
          }}
        />
      </div>
      <div className="prompt__buttons">
        <Button
          onClick={() => {
            optionData.action?.(codeValue);
          }}
        >
          Confirm
        </Button>
        <Button
          theme="link"
          onClick={() => {
            optionData.resendAction?.();
          }}
        >
          Resend
        </Button>
      </div>
    </div>
  );
}
