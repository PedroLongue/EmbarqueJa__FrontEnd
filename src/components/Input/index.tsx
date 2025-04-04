import { TextField } from '@mui/material';
import { ComponentProps } from 'react';

interface IInputProps extends ComponentProps<typeof TextField> {
  label: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time';
}

const Input = ({ label, type = 'text', ...props }: IInputProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      type={type}
      fullWidth
      InputLabelProps={{ shrink: !!props.value }}
      {...props}
    />
  );
};

export default Input;
