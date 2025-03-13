import { FC } from "react";
import "./input.scss";

interface InputProps {
  placeholder: string;
  value?: number | string;
  type?: string;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  placeholder,
  value = "",
  type = "text",
  onChange,
  max = "",
  min = "",
}) => {
  return (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
    />
  );
};

export default Input;
