import { TextField } from '@mui/material';
import { ComponentProps } from 'react';

interface IInputProps extends ComponentProps<typeof TextField> {
  label: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time';
  shrink?: boolean;
  helperText?: string;
}

const Input = ({
  label,
  type = 'text',
  shrink,
  helperText,
  ...props
}: IInputProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      type={type}
      fullWidth
      {...(shrink && {
        InputLabelProps: { shrink },
      })}
      helperText={helperText}
      {...props}
    />
  );
};

export default Input;
