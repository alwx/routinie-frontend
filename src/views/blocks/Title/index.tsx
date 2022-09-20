import React from "react";

import "./Title.scss";

interface Props {
  value: string;
}

export default function Title({ value }: Props) {
  return <div className="title">{value}</div>;
}
