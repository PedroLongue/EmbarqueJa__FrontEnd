import { Box, Grid } from '@mui/material';
import React from 'react';

const PixPayment = () => {
  return (
    <Grid
      item
      xs={12}
      md={6}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          width: 200,
          height: 200,
          bgcolor: '#f0f0f0',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Aqui pode ir o ícone ou imagem do PIX */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/1034/1034125.png"
          alt="PIX"
          style={{ width: 100 }}
        />
      </Box>
    </Grid>
  );
};

export default PixPayment;
