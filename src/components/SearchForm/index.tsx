import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import Input from '../Input';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Button from '../Button';
import useCities from '../../hooks/useCities';
import { useState } from 'react';

const MAX_PASSENGERS = [1, 2, 3, 4, 5];

const SeachForm = () => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const cities = useCities();

  const filteredOriginCities = cities.filter((city) => city !== destination);
  const filteredDestinationCities = cities.filter((city) => city !== origin);

  const handleOriginChange = (event: React.SyntheticEvent, value: string) => {
    setOrigin(value);
    if (value === destination) {
      setDestination('');
    }
  };

  const handleDestinationChange = (
    event: React.SyntheticEvent,
    value: string,
  ) => {
    setDestination(value);
    if (value === origin) {
      setOrigin('');
    }
  };

  return (
    <Box
      sx={{ background: '#EDEDED' }}
      position={'absolute'}
      bottom={'-50px'}
      padding={2}
      borderRadius={2}
    >
      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            onInputChange={handleOriginChange}
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
            onInputChange={handleDestinationChange}
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
            onChange={(e) => console.log(e)}
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
            onClick={() => console.log('Clicou no botão')}
            children="Buscar"
            variant="contained"
            sx={{ textTransform: 'none', width: '100px' }}
          />
        </Stack>
      </form>
    </Box>
  );
};

export default SeachForm;
