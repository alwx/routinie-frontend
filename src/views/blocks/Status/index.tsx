import React from "react";

import "./Status.scss";

interface Props {
  style: string;
}

export default function Status({ style }: Props) {
  const className = React.useMemo(() => {
    return "status" + (style ? " status--" + style : "");
  }, [style]);

  return <div className={className} />;
}
