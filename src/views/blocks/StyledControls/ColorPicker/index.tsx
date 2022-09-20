import React from "react";
import { RGBColor, TwitterPicker } from "react-color";

import "./ColorPicker.scss";

const formatToString = (rgba?: RGBColor): string => {
  if (rgba) {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }
  return "";
};

const formatFromString = (value?: string): RGBColor | undefined => {
  if (!value) {
    return undefined;
  }
  const re = /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([.\d]+)\)/g;
  const a = re.exec(value);
  if (a && a.length === 5) {
    return { r: +a[1], g: +a[2], b: +a[3], a: +a[4] };
  }
  return undefined;
};

interface Props {
  htmlId: string;
  label?: string;
  defaultValue?: string;
  isDisabled?: boolean;
  onChange?: (color: string) => void;
}

export default function ColorPicker({
  htmlId,
  label,
  defaultValue,
  isDisabled,
  onChange,
}: Props) {
  const [color, setColor] = React.useState(formatFromString(defaultValue));
  const [isColorPickerShown, setColorPickerShown] = React.useState(false);

  React.useEffect(() => {
    setColor(formatFromString(defaultValue));
  }, [defaultValue]);

  return (
    <React.Fragment>
      {label && (
        <label className="styled-label" htmlFor={htmlId}>
          {label}
        </label>
      )}
      <div className="color-picker">
        <button
          className={
            "color-picker__link" +
            (isDisabled ? " color-picker__link--disabled" : "")
          }
          onClick={(e) => {
            e.preventDefault();
            if (!isDisabled) {
              setColorPickerShown(!isColorPickerShown);
            }
            return false;
          }}
        >
          <span
            className="color-picker__color"
            style={{
              backgroundColor: !isDisabled ? formatToString(color) : "",
            }}
          />
          <span className="color-picker__change-text">Change</span>
        </button>
        {isColorPickerShown ? (
          <div className="color-picker__popover">
            <div
              className="color-picker__cover"
              onClick={(e) => {
                e.preventDefault();
                setColorPickerShown(false);
                onChange?.(formatToString(color));
                return false;
              }}
            />
            <TwitterPicker
              className="color-picker__picker"
              color={color}
              onChange={(color) => {
                setColor(color.rgb);
                onChange?.(formatToString(color.rgb));
              }}
            />
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}
