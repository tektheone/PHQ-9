import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
}

export const Radio = ({ label, checked, className = '', ...props }: RadioProps) => {
  return (
    <label className={`group flex items-center cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="radio"
          className="sr-only"
          checked={checked}
          {...props}
        />
        <div
          className={`
            w-5 h-5 border-2 rounded-full
            transition-all duration-200 ease-bounce-in
            group-hover:border-blue-500
            ${checked ? 'border-blue-500' : 'border-gray-300'}
          `}
        >
          <div
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-2.5 h-2.5 rounded-full bg-blue-500
              transition-all duration-200 ease-bounce-in
              ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `}
          />
        </div>
      </div>
      <span className={`ml-3 text-gray-700 font-medium transition-colors duration-200 ${checked ? 'text-blue-600' : ''}`}>
        {label}
      </span>
    </label>
  );
};
