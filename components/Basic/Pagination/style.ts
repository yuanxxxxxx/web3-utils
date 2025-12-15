import styled from "styled-components";

interface PaginationWrapperProps {
  $size?: "default" | "small";
}

export const PaginationWrapper = styled.div<PaginationWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $size }) => ($size === "small" ? "16px 12px" : "24px 16px")};
  gap: ${({ $size }) => ($size === "small" ? "12px" : "16px")};
  flex-wrap: wrap;

  .pagination-info {
    font-size: ${({ $size }) => ($size === "small" ? "12px" : "14px")};
    color: #000;
    font-weight: 400;
  }

  .rc-pagination {
    display: flex;
    align-items: center;
    gap: ${({ $size }) => ($size === "small" ? "3px" : "4px")};
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: ${({ $size }) => ($size === "small" ? "12px" : "14px")};
    margin-left: auto;
  }

  .rc-pagination-item,
  .rc-pagination-prev,
  .rc-pagination-next,
  .rc-pagination-jump-prev,
  .rc-pagination-jump-next {
    min-width: ${({ $size }) => ($size === "small" ? "28px" : "36px")};
    height: ${({ $size }) => ($size === "small" ? "28px" : "36px")};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #E0E0E0;
    border-radius: ${({ $size }) => ($size === "small" ? "6px" : "8px")};
    background: #F5F5F5;
    color: #000;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    outline: none;
    margin: 0;
    padding: ${({ $size }) => ($size === "small" ? "0 6px" : "0 8px")};

    &:hover {
      border-color: #E0E0E0;
      background: #F5F5F5;
      color: #000;
    }

    a {
      color: inherit;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
    }
  }

  .rc-pagination-item-active {
    border-color: #000;
    background: #000;
    color: #ffffff;
    font-weight: 600;

    &:hover {
      border-color: #000;
      background: #000;
      color: #ffffff;
    }
  }

  .rc-pagination-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;

    &:hover {
      border-color: #E0E0E0;
      background: #F5F5F5;
    }
  }

  .rc-pagination-jump-prev,
  .rc-pagination-jump-next {
    .rc-pagination-item-container {
      .rc-pagination-item-link-icon {
        color: #000;
        font-size: ${({ $size }) => ($size === "small" ? "10px" : "12px")};
      }
    }

    &:hover {
      .rc-pagination-item-container {
        .rc-pagination-item-link-icon {
          color: #000;
        }
      }
    }
  }

  .rc-pagination-prev,
  .rc-pagination-next {
    padding: ${({ $size }) => ($size === "small" ? "0 8px" : "0 10px")};

    button {
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      outline: none;

      svg {
        width: ${({ $size }) => ($size === "small" ? "6px" : "8px")};
        height: ${({ $size }) => ($size === "small" ? "10px" : "12px")};
      }
    }
  }

  .rc-pagination-options {
    display: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    .rc-pagination {
      margin-left: 0;
      width: 100%;
      justify-content: center;
    }

    .pagination-info {
      width: 100%;
      text-align: center;
    }
  }
`;

