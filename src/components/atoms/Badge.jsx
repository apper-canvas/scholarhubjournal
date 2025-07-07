import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Badge = forwardRef(({ 
  variant = 'default', 
  size = 'md',
  className = '', 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center gap-1 font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    present: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    late: "bg-yellow-100 text-yellow-800",
    excused: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm"
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;