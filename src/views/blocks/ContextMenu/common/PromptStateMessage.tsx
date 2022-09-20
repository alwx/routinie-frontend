import React from "react";
import { StateMessage, StateMessageType } from "../../../../types/contextMenu";

interface Props {
  stateMessage?: StateMessage;
}

export default function PromptStateMessage({ stateMessage }: Props) {
  if (stateMessage?.stateMessage) {
    const extraClass =
      "prompt__state-message--" +
      (stateMessage.stateMessageType || StateMessageType.ERROR);

    return (
      <div className={"prompt__state-message " + extraClass}>
        {stateMessage.stateMessage}
      </div>
    );
  }
  return null;
}
