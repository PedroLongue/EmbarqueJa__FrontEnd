import { SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import { ReactNode, MouseEventHandler } from 'react';

interface IButtonProps {
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  sx?: SxProps<Theme>;
  type?: 'button' | 'reset' | 'submit';
  onClick?:
    | (() => void | undefined)
    | undefined
    | MouseEventHandler<HTMLButtonElement>;
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
  ref?: React.Ref<HTMLButtonElement>;
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
  ref,
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
      ref={ref}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
