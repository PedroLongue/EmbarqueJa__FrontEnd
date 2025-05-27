import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './global.css';
import AppRouter from './router/index.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRouter />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
