import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Select = forwardRef(({ 
  className = '', 
  error = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 border rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const errorStyles = error ? "border-red-300 focus:ring-red-500" : "border-gray-300";
  
  return (
    <select
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;