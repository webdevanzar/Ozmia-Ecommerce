import type React from "react";


type InputProps = {
  id: string;
  type: string;
  name: string;
  label: string;
  value: string | number;
  className?: string;
  labelClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isTouched?: boolean;
};

export const Input: React.FC<InputProps> = ({
  id,
  label,
  name,
  type,
  value,
  onChange,
  className,
  labelClassName,
  error,
}) => {


  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        className={`border-b-2 border-white p-2 outline-none font-semibold bg-transparent ${className}`}
        onChange={onChange}
      />
      <p className="text-[12px] text-red-900">{error}</p>
    </div>
  );
};
