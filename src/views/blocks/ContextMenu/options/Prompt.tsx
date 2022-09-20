import React from "react";
import { marked } from "marked";

import { Button } from "../../StyledControls";
import RichTitle from "../common/RichTitle";

export type PromptButton = {
  theme?: string;
  action?: () => any;
  text: string;
};

export type PromptData = {
  title: string;
  text?: string;
  buttons: PromptButton[];
};

interface Props {
  optionData: PromptData;
}

export default function Prompt({ optionData }: Props) {
  return (
    <div className="prompt">
      <RichTitle title={optionData.title} />
      {optionData.text && (
        <div
          className="prompt__text"
          dangerouslySetInnerHTML={{ __html: marked.parse(optionData.text) }}
        ></div>
      )}
      <div className="prompt__buttons">
        {optionData.buttons.map((button, index) => {
          return (
            <Button
              key={`button-${index}`}
              theme={button.theme}
              onClick={button.action}
            >
              {button.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
