import React from "react";

interface Props {
  title: string;
}

export default function TitleEntry({ title }: Props) {
  return <li className="entry entry__title">{title}</li>;
}
