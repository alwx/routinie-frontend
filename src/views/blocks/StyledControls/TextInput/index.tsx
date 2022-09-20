import React, {
  ChangeEventHandler,
  EventHandler,
  KeyboardEvent,
  LegacyRef,
} from "react";

import "./TextInput.scss";

interface Props {
  htmlId: string;
  inputRef: LegacyRef<HTMLInputElement>;
  label?: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  isDisabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyPress?: EventHandler<KeyboardEvent<HTMLInputElement>>;
}

export default function TextInput({
  htmlId,
  inputRef,
  label,
  defaultValue,
  type,
  placeholder,
  isDisabled,
  onChange,
  onKeyPress,
}: Props) {
  return (
    <React.Fragment>
      {label && (
        <label className="styled-label" htmlFor={htmlId}>
          {label}
        </label>
      )}
      <input
        className="text-input"
        id={htmlId}
        name={htmlId}
        placeholder={placeholder}
        disabled={isDisabled}
        ref={inputRef}
        onChange={onChange}
        onKeyPress={onKeyPress}
        defaultValue={defaultValue}
        value={defaultValue}
        type={type || "text"}
      />
    </React.Fragment>
  );
}
