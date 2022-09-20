import React from "react";
import { Button, TextInput } from "../../StyledControls";
import PromptStateMessage from "../common/PromptStateMessage";
import RichTitle from "../common/RichTitle";

export type ChangeTextFieldData = {
  action?: (text: string) => any;
  cancelAction?: () => any;
  title?: string;
  fieldLabel?: string;
};

interface Props {
  optionData: ChangeTextFieldData;
  contextMenuData?: any;
}

export default function ChangeTextField({
  optionData,
  contextMenuData,
}: Props) {
  const textFieldRef = React.useRef<HTMLInputElement | null>(null);

  const [textFieldValue, setTextFieldValue] = React.useState("");

  React.useEffect(() => {
    setTimeout(() => textFieldRef?.current?.focus(), 50);
  }, []);

  return (
    <div className="prompt">
      <RichTitle title={optionData.title || ""} />
      <PromptStateMessage stateMessage={contextMenuData} />
      <div className="prompt__custom-content">
        <TextInput
          inputRef={textFieldRef}
          htmlId="text-field"
          label={optionData.fieldLabel}
          defaultValue={textFieldValue}
          onChange={(e) => {
            setTextFieldValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              optionData.action?.(textFieldValue);
            }
          }}
        />
      </div>
      <div className="prompt__buttons">
        <Button
          onClick={() => {
            optionData.action?.(textFieldValue);
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
