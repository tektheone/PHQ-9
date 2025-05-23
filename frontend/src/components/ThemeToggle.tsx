import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex(0);
      return;
    }

    if (isOpen) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % options.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + options.length) % options.length);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0) {
            setTheme(options[activeIndex].value as 'light' | 'dark' | 'system');
            setIsOpen(false);
            setActiveIndex(-1);
            buttonRef.current?.focus();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'Tab':
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          break;
      }
    }
  };

  // Focus management
  React.useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  const options = [
    { value: 'light', label: 'Light', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { value: 'dark', label: 'Dark', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )},
    { value: 'system', label: 'System', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
  ];

  return (
    <div className="relative inline-block" onKeyDown={handleKeyDown} ref={dropdownRef}>
      {/* Backdrop for closing dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <button
        ref={buttonRef}
        type="button"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out shadow-sm hover:shadow active:scale-95"
        aria-label="Theme settings"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {options.find(opt => opt.value === theme)?.icon}
        <span className="hidden sm:inline-block">{options.find(opt => opt.value === theme)?.label}</span>
        <svg className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-2 w-40 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-200 ease-in-out z-50 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="theme-menu-button"
      >
        {options.map((option, index) => (
          <button
            key={option.value}
            ref={(el: HTMLButtonElement | null) => {
              if (el) optionRefs.current[index] = el;
            }}
            onClick={() => {
              setTheme(option.value as 'light' | 'dark' | 'system');
              setIsOpen(false);
              buttonRef.current?.focus();
            }}
            tabIndex={isOpen ? 0 : -1}
            role="menuitem"
            aria-selected={theme === option.value}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${theme === option.value ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} transition-colors duration-150`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
