import { TextField } from '@mui/material';
import { ComponentProps } from 'react';

interface IInputProps extends ComponentProps<typeof TextField> {
  label: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time';
  shrink?: boolean;
}

const Input = ({ label, type = 'text', shrink, ...props }: IInputProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      type={type}
      fullWidth
      {...(shrink && {
        InputLabelProps: { shrink },
      })}
      {...props}
    />
  );
};

export default Input;
