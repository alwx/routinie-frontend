import React from "react";
import { Button, TextInput } from "../../StyledControls";
import PromptStateMessage from "../common/PromptStateMessage";
import RichTitle from "../common/RichTitle";

export type SignInData = {
  text?: string;
  action?: (email: string, password: string) => any;
  remindPasswordAction?: (email: string) => any;
};

interface Props {
  optionData: SignInData;
  contextMenuData?: any;
}

export default function SignIn({ optionData, contextMenuData }: Props) {
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");

  React.useEffect(() => {
    setTimeout(() => emailRef?.current?.focus(), 50);
  }, []);

  return (
    <div className="prompt">
      <RichTitle title="Welcome back!" />
      {optionData.text && <div className="prompt__text">{optionData.text}</div>}
      <PromptStateMessage stateMessage={contextMenuData} />
      <div className="prompt__custom-content">
        <TextInput
          inputRef={emailRef}
          htmlId="email"
          label="E-mail:"
          onChange={(e) => {
            setEmailValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setTimeout(() => passwordRef?.current?.focus(), 50);
            }
          }}
        />
        <TextInput
          inputRef={passwordRef}
          htmlId="password"
          label="Password:"
          type="password"
          onChange={(e) => {
            setPasswordValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              optionData.action?.(emailValue, passwordValue);
            }
          }}
        />
      </div>
      <div className="prompt__buttons">
        <Button
          onClick={() => {
            optionData.action?.(emailValue, passwordValue);
          }}
        >
          Sign in
        </Button>
        <Button
          theme="link"
          onClick={() => {
            optionData.remindPasswordAction?.(emailValue);
          }}
        >
          Remind password
        </Button>
      </div>
    </div>
  );
}
