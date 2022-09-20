import React, { EventHandler, KeyboardEvent, LegacyRef } from "react";

import "./Radio.scss";

interface Value {
  key: string;
  label: string;
}

interface Props {
  htmlId: string;
  inputRef: LegacyRef<HTMLInputElement>;
  values: Value[];
  defaultValue?: string;
  placeholder?: string;
  isDisabled?: boolean;
  onChange: (key: string) => void;
  onKeyPress?: EventHandler<KeyboardEvent<HTMLInputElement>>;
}

export default function Radio({
  htmlId,
  inputRef,
  values,
  defaultValue,
  placeholder,
  isDisabled,
  onChange,
}: Props) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="radio-container">
      {values.map((v) => {
        return (
          <label className="radio" key={`radio-${htmlId}-${v.key}`}>
            <span className="radio__label">{v.label}</span>
            <input
              className="radio__input"
              id={htmlId}
              name={htmlId}
              placeholder={placeholder}
              disabled={isDisabled}
              ref={inputRef}
              onChange={() => {
                setValue(v.key);
                onChange(v.key);
              }}
              checked={value === v.key}
              type="radio"
            />
            <span className="radio__checkmark" />
          </label>
        );
      })}
    </div>
  );
}
