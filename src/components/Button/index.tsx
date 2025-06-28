import { SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';

interface IButtonProps {
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  sx?: SxProps<Theme>;
  type?: 'button' | 'reset' | 'submit';
  onClick?: (() => void | undefined) | undefined;
  disabled?: boolean;
  id?: string;
  fullWidth?: boolean;
  color?:
    | 'primary'
    | 'secondary'
    | 'inherit'
    | 'error'
    | 'success'
    | 'info'
    | 'warning';
  dataTestId?: string;
}

const CustomButton = ({
  children,
  variant,
  sx,
  type,
  disabled,
  id,
  fullWidth,
  color,
  dataTestId,
  ...props
}: IButtonProps) => {
  return (
    <Button
      {...props}
      variant={variant}
      sx={sx}
      type={type}
      disabled={disabled}
      color={color}
      data-testid={dataTestId}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
