import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Button from '../Button';
import useCities from '../../hooks/useCities';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  setOrigin,
  setDestination,
  setDepartureDate,
  fetchTickets,
} from '../../redux/features/searchSlice';
import Input from '../Input';
import { useState } from 'react';
import CustomSnackbar from '../CustomSnackbar';

const MAX_PASSENGERS = [1, 2, 3, 4, 5];

const SeachForm = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<any>('error');

  const dispatch = useDispatch<AppDispatch>();
  const { origin, destination, departureDate, loading, error } = useSelector(
    (state: RootState) => state.search,
  );
  const cities = useCities();

  const filteredOriginCities = cities.filter((city) => city !== destination);
  const filteredDestinationCities = cities.filter((city) => city !== origin);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
      setSnackbarMessage('Por favor, preencha todos os campos');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    dispatch(fetchTickets());
  };

  return (
    <Box
      sx={{ background: '#EDEDED' }}
      position={'absolute'}
      bottom={'-50px'}
      padding={2}
      borderRadius={2}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <Stack
          direction="row"
          spacing={2}
          width={500}
          alignItems={'center'}
          sx={{
            margin: '0 auto',
          }}
        >
          <Autocomplete
            disablePortal
            options={filteredOriginCities}
            value={origin}
            onInputChange={(_, value) => dispatch(setOrigin(value))}
            renderInput={(params) => (
              <Input {...params} label="Origem" variant="standard" />
            )}
            sx={{ width: '100%' }}
          />
          <SyncAltIcon />
          <Autocomplete
            disablePortal
            options={filteredDestinationCities}
            value={destination}
            onInputChange={(_, value) => dispatch(setDestination(value))}
            renderInput={(params) => (
              <Input {...params} label="Destino" variant="standard" />
            )}
            sx={{ width: '100%' }}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Input
            id="date"
            label="Data ida"
            variant="standard"
            type="date"
            value={departureDate}
            onChange={(e) => dispatch(setDepartureDate(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
          <FormControl variant="standard" fullWidth>
            <InputLabel id="passengers-label">Passageiros</InputLabel>
            <Select
              labelId="passengers-label"
              id="passengers"
              label="Passageiros"
              onChange={(e) => console.log(e)}
              MenuProps={{
                PaperProps: {
                  style: {
                    width: '100%',
                    maxWidth: '0',
                  },
                },
              }}
              fullWidth
            >
              {MAX_PASSENGERS.map((element) => (
                <MenuItem key={element} value={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack width={'100%'} alignItems={'flex-end'}>
          <Button
            type="submit"
            children={loading ? 'Buscando...' : 'Buscar'}
            variant="contained"
            sx={{ textTransform: 'none', width: '100px' }}
            disabled={loading}
          />
        </Stack>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </Box>
  );
};

export default SeachForm;
