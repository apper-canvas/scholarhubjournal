import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  options = [], 
  required = false, 
  error = '',
  placeholder = '',
  className = ''
}) => {
  return (
    <div className={className}>
      <Label required={required} htmlFor={name}>
        {label}
      </Label>
      {type === 'select' ? (
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          error={!!error}
          required={required}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={!!error}
          required={required}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;