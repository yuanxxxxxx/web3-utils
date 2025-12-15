import React from "react";
import RcPagination from "rc-pagination";
import { PaginationWrapper } from "./style";
import "rc-pagination/assets/index.css";

interface Props {
  current: number;
  total: number;
  pageSize?: number;
  onChange: (page: number, pageSize: number) => void;
  showTotal?: boolean;
  className?: string;
  size?: "default" | "small";
}

export default function Pagination({
  current,
  total,
  pageSize = 10,
  onChange,
  showTotal = true,
  className = "",
  size = "default",
}: Props) {
  const totalPages = Math.ceil(total / pageSize);
  
  const showTotalText = (total: number, range: [number, number]) => {
    return `${range[0]}-${range[1]} of ${total}`;
  };

  if (total === 0) {
    return null;
  }

  return (
    <PaginationWrapper className={className} $size={size}>
      {showTotal && totalPages > 0 && (
        <div className="pagination-info">
          Showing {Math.min((current - 1) * pageSize + 1, total)} to{" "}
          {Math.min(current * pageSize, total)} of {total} results
        </div>
      )}
      
      <RcPagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showLessItems
        showPrevNextJumpers={true}
        showTitle={false}
        prevIcon={
          <svg
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1L2 6L7 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        nextIcon={
          <svg
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L6 6L1 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </PaginationWrapper>
  );
}

