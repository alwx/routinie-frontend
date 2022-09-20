import React, { ChangeEventHandler, LegacyRef, ReactNode } from "react";

import "./Checkbox.scss";

interface Props {
  htmlId: string;
  inputRef: LegacyRef<HTMLInputElement>;
  label?: string | ReactNode;
  defaultValue?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function Checkbox({
  htmlId,
  inputRef,
  label,
  onChange,
  defaultValue,
  placeholder,
  isDisabled,
}: Props) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="checkbox-container">
      <label className="checkbox">
        <span className="checkbox__label">{label}</span>
        <input
          className="checkbox__input"
          id={htmlId}
          name={htmlId}
          placeholder={placeholder}
          disabled={isDisabled}
          ref={inputRef}
          onChange={onChange}
          checked={value}
          type="checkbox"
        />
        <span className="checkbox__checkmark" />
      </label>
    </div>
  );
}
