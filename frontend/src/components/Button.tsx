import React, { useState, useEffect } from 'react';

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  useEffect(() => {
    const timeouts = ripples.map((ripple) =>
      setTimeout(() => {
        setRipples((prevRipples) =>
          prevRipples.filter((r) => r.id !== ripple.id)
        );
      }, 800)
    );

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [ripples]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples([...ripples, { x, y, id: Date.now() }]);

    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles = [
    'relative overflow-hidden rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:animate-tap'
  ].join(' ');

  const variantStyles = {
    primary: [
      'bg-blue-500 text-white',
      'hover:bg-blue-600',
      'focus:ring-blue-500'
    ].join(' '),
    secondary: [
      'bg-gray-100 text-gray-900',
      'hover:bg-gray-200',
      'focus:ring-gray-500'
    ].join(' ')
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={[baseStyles, variantStyles[variant], widthStyles, className].filter(Boolean).join(' ')}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      {children}
    </button>
  );
};
