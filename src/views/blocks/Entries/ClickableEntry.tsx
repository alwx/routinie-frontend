import React from "react";

interface Props {
  title: string;
  description: string;
  links?: Link[];
}

interface Link {
  title: string;
  key: string;
  onClick: () => any;
}

export default function ClickableEntry({ title, description, links }: Props) {
  return (
    <li className="entry">
      <div className="entry__name">
        <div className="entry__name-text">{title}</div>
      </div>
      <div className="entry__content">{description}</div>
      {links && (
        <div className="entry__content">
          {links.map(({ key, title, onClick }) => {
            return (
              <span
                key={"entry__link__" + key}
                className="entry__content-link"
                onClick={(e) => {
                  onClick?.();
                  e.preventDefault();
                  return false;
                }}
              >
                {title}
              </span>
            );
          })}
        </div>
      )}
    </li>
  );
}
