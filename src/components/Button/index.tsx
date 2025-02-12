import { SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';

interface IButtonProps {
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  sx?: SxProps<Theme>;
}

const CustomButton = ({ children, variant, sx, ...props }: IButtonProps) => {
  return (
    <Button variant={variant} sx={sx} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
