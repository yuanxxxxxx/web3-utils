import { useState, useEffect, useRef } from 'react';
import Arrow1 from '/public/image/icon/arrow1.svg';
import styled from 'styled-components';
import { DropdownButton, DropdownContainer, DropdownMenu, DropdownMenuItem } from './style';

interface DropdownProps {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  onClick?: () => void;
  placeholder?: string;
  fullWidth?: boolean;
  minimal?: boolean; // 无背景色、无边框、宽度 auto
}

export default function Dropdown({ 
  value, 
  options, 
  onChange, 
  style, 
  onClick, 
  placeholder = 'Select',
  fullWidth = false,
  minimal = false
}: DropdownProps) {
  const [showMenu, setShowMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const showTitle = options.find(option => option.value === value)?.label || placeholder;
  
  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
    onClick?.();
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMenu]);
  
  return (
    <DropdownContainer
      ref={containerRef}
      style={style}
      $fullWidth={fullWidth}
      $minimal={minimal}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <DropdownButton
        $showMenu={showMenu}
        $minimal={minimal}
        onClick={handleToggleMenu}
      >
        <span>{showTitle}</span>
        <img
          src={Arrow1.src}
          alt="arrow"
          style={{
            width: '16px',
            height: '16px',
            transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'all 0.2s ease-in-out'
          }}
        />
      </DropdownButton>
      <DropdownMenu $showMenu={showMenu}>
        <div className="dropdown-menu-box">
          {options.map(option => (
            <DropdownMenuItem
              key={option.value}
              $active={value === option.value}
              onClick={() => {
                onChange(option.value);
                setShowMenu(false);
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenu>
    </DropdownContainer>
  );
}
