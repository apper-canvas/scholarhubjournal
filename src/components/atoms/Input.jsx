import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Input = forwardRef(({ 
  type = 'text', 
  className = '', 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 border rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const errorStyles = error ? "border-red-300 focus:ring-red-500" : "border-gray-300";
  
  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;