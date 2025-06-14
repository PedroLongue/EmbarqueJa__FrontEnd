import { TextField, InputAdornment, IconButton } from '@mui/material';
import { ComponentProps, useState } from 'react';
import Icon from '../../assets/Icons';

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
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <TextField
      label={label}
      variant="outlined"
      type={inputType}
      fullWidth
      helperText={helperText}
      {...(shrink && {
        InputLabelProps: { shrink },
      })}
      {...(isPassword && {
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? (
                  <Icon name="visibilityOffPassword" />
                ) : (
                  <Icon name="visibilityPassword" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      })}
      {...props}
    />
  );
};

export default Input;
