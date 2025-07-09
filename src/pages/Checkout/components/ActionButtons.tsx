import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import Button from '../../../components/Button';

interface ActionButtonsProps {
  loading: boolean;
  acceptedTerms: boolean;
  isValid: boolean;
  paymentMethod: string;
  pixStatus: 'inicial' | 'pending' | 'success';
  onCancel: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  acceptedTerms,
  isValid,
  paymentMethod,
  pixStatus,
  onCancel,
}) => (
  <Box
    mt={3}
    display="flex"
    justifyContent="flex-end"
    gap={2}
    textAlign="right"
  >
    <Button
      variant="contained"
      onClick={onCancel}
      color="error"
      dataTestId="button-cancel-reservation-and-payment"
      disabled={loading}
    >
      Cancelar reserva
    </Button>
    <Button
      variant="contained"
      color="primary"
      type="submit"
      dataTestId="button-confirm-payment"
      disabled={
        !acceptedTerms ||
        (paymentMethod === 'credit-card' && !isValid) ||
        (paymentMethod === 'pix' && pixStatus !== 'success') ||
        loading
      }
    >
      {loading ? (
        <CircularProgress
          sx={{ width: '20px !important', height: '20px !important' }}
        />
      ) : (
        'Finalizar compra'
      )}
    </Button>
  </Box>
);

export default ActionButtons;
