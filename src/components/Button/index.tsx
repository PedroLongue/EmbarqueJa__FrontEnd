import { SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';

interface IButtonProps {
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  sx?: SxProps<Theme>;
  type?: 'button' | 'reset' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

const CustomButton = ({
  children,
  variant,
  sx,
  type,
  disabled,
  ...props
}: IButtonProps) => {
  return (
    <Button variant={variant} sx={sx} {...props} type={type}>
      {children}
    </Button>
  );
};

export default CustomButton;
