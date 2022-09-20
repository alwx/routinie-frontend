import React from "react";

import { useAppDispatch } from "../../../../hooks/store";
import { closeContextMenu } from "../../../../store/contextMenu";
import { Button } from "../../StyledControls";

import "./RichTitle.scss";

interface Props {
  title: string;
}

export default function RichTitle({ title }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className="rich-title">
      <h1 className="rich-title__title">{title}</h1>
      <Button
        theme="close"
        onClick={() => {
          dispatch(closeContextMenu());
        }}
      >
        ✕
      </Button>
    </div>
  );
}
