import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';

interface TermsCheckboxProps {
  accepted: boolean;
  onChange: (value: boolean) => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  accepted,
  onChange,
}) => (
  <FormControlLabel
    sx={{ mt: 2 }}
    control={
      <Checkbox
        checked={accepted}
        onChange={(e) => onChange(e.target.checked)}
        data-testid="checkbox-terms"
      />
    }
    label={
      <Typography variant="body2" fontWeight="bold">
        Concordo com a política de privacidade e os contratos de transporte.
      </Typography>
    }
  />
);

export default TermsCheckbox;
