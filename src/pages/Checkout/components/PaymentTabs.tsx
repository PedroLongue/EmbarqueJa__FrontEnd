import React from 'react';
import { Box, Grid, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CreditCardPayment from './CreditCardPayment';
import PixPayment from './PixPayment';

interface PaymentTabsProps {
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
  pixStatus: 'inicial' | 'pending' | 'success';
  handlePixPayment: () => void;
}

const PaymentTabs = ({
  value,
  onChange,
  pixStatus,
  handlePixPayment,
}: PaymentTabsProps) => (
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList onChange={onChange} variant="fullWidth">
        <Tab
          label="Cartão de Crédito"
          value="1"
          data-testid="tab-credit-card"
        />
        <Tab label="Pix" value="2" data-testid="tab-pix" />
      </TabList>
    </Box>
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12}>
        <TabPanel value="1">
          <CreditCardPayment />
        </TabPanel>
        <TabPanel value="2">
          <PixPayment handlePayment={handlePixPayment} status={pixStatus} />
        </TabPanel>
      </Grid>
    </Grid>
  </TabContext>
);

export default PaymentTabs;
