import React from "react";

import "./Spinner.scss";

interface Props {
  isActive?: boolean;
}

export default function Spinner({ isActive }: Props) {
  return <div className={"spinner" + (isActive ? "" : " spinner--inactive")} />;
}
