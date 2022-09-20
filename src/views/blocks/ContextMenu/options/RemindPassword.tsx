import React from "react";
import { Button, TextInput } from "../../StyledControls";
import PromptStateMessage from "../common/PromptStateMessage";
import RichTitle from "../common/RichTitle";

export type RemindPasswordData = {
  email?: string;
  action?: (email: string) => any;
  alreadyHaveCodeAction?: () => any;
};

interface Props {
  optionData: RemindPasswordData;
  contextMenuData?: any;
}

export default function RemindPassword({ optionData, contextMenuData }: Props) {
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const [emailValue, setEmailValue] = React.useState(optionData.email || "");

  return (
    <div className="prompt">
      <RichTitle title="Remind password" />
      <PromptStateMessage stateMessage={contextMenuData} />
      <div className="prompt__custom-content">
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
              optionData.action?.(emailValue);
            }
          }}
        />
      </div>
      <div className="prompt__buttons">
        <Button
          onClick={() => {
            optionData.action?.(emailValue);
          }}
        >
          Continue
        </Button>

        <Button
          theme="link"
          onClick={() => {
            optionData.alreadyHaveCodeAction?.();
          }}
        >
          I already have a code
        </Button>
      </div>
    </div>
  );
}
