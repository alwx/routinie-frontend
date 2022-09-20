import React from "react";

import { ReactComponent as IconArrowRight } from "../../../icons/arrow-right.svg";
import "./Breadcrumbs.scss";
import { useHistory } from "react-router";

export type BreadcrumbsPage = {
  id: string;
  title: string;
  link: string;
};

interface Props {
  pages?: (BreadcrumbsPage | null)[];
}

const ArrowRight = () => {
  return (
    <div className="breadcrumbs-arrow">
      <div className="breadcrumbs-icon">
        <IconArrowRight />
      </div>
    </div>
  );
};

const BreadcrumbsItem = ({ page }: { page: BreadcrumbsPage }) => {
  const { push } = useHistory();

  return (
    <React.Fragment>
      <div
        className="breadcrumbs-button"
        onClick={() => {
          push(page.link, false);
        }}
      >
        {page.title}
      </div>
      <ArrowRight />
    </React.Fragment>
  );
};

export default function Breadcrumbs({ pages }: Props) {
  return (
    <div className="breadcrumbs">
      {pages &&
        pages.map((page) => {
          if (!page) {
            return null;
          }
          return (
            <BreadcrumbsItem key={`breadcrumbs-item__${page.id}`} page={page} />
          );
        })}
    </div>
  );
}
