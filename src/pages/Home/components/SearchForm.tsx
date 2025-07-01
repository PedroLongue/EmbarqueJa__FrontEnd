import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  IconButton,
  Tooltip,
  useMediaQuery,
  Popover,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '../../../components/Button';
import useCities from '../../../hooks/useCities';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import {
  setOrigin,
  setDestination,
  setDepartureDate,
  fetchTickets,
  setPassengers,
} from '../../../redux/features/searchSlice';
import Input from '../../../components/Input';
import { useState } from 'react';
import CustomSnackbar from '../../../components/CustomSnackbar';
import Icon from '../../../assets/Icons';
import { SnackbarSeverity } from '../../../types';
import theme from '../../../theme';
import { isIOS } from 'react-device-detect';
import { formatDate } from '../../../utils/inputMark';

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error:
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported';
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const MAX_PASSENGERS = [1, 2, 3, 4, 5];

const SeachForm = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('error');
  const [isListening, setIsListening] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { origin, destination, departureDate, loading } = useSelector(
    (state: RootState) => state.search,
  );
  const cities = useCities();

  const filteredOriginCities = cities.filter((city) => city !== destination);
  const filteredDestinationCities = cities.filter((city) => city !== origin);

  const findCityMatch = (input: string) => {
    const inputNormalized = input.toLowerCase().trim();
    return (
      cities.find((city) => city.toLowerCase() === inputNormalized) ||
      capitalize(input)
    );
  };

  const toISODate = (brDate: string) => {
    const [day, month, year] = brDate.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
      setSnackbarMessage('Por favor, preencha todos os campos');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const formattedDate = isIOS ? toISODate(departureDate) : departureDate;
    dispatch(setDepartureDate(formattedDate));
    dispatch(fetchTickets());
  };

  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSnackbarMessage('Navegador não suporta reconhecimento de voz');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase();

      if (transcript.includes('origem')) {
        const voiceValue = transcript.replace('origem', '').trim();
        const cidadeMatch = findCityMatch(voiceValue);
        dispatch(setOrigin(cidadeMatch));
      }

      if (transcript.includes('destino')) {
        const voiceValue = transcript.replace('destino', '').trim();
        const cidadeMatch = findCityMatch(voiceValue);
        dispatch(setDestination(cidadeMatch));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      setSnackbarMessage('Erro no reconhecimento de voz');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsListening(false);
    };

    recognition.start();
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorTooltipModal, setAnchorTooltipModal] =
    useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorTooltipModal(event.currentTarget);
  };

  const handleClose = () => setAnchorTooltipModal(null);

  const openTooltipModal = Boolean(anchorTooltipModal);

  return (
    <>
      <Box
        sx={{
          background: '#EDEDED',
          position: 'absolute',
          bottom: '-100px',
          padding: 2,
          borderRadius: 2,
          width: '90%',
          maxWidth: '520px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <Stack direction={'row'} spacing={2} width="100%" alignItems="center">
            <Autocomplete
              disablePortal
              options={filteredOriginCities}
              value={origin}
              onInputChange={(_, value) => dispatch(setOrigin(value))}
              renderInput={(params) => (
                <Input
                  {...params}
                  label="Origem"
                  variant="standard"
                  datatestId="input-origin"
                />
              )}
              sx={{ width: '100%' }}
            />
            <Box display="flex" flexDirection="column" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton
                  onClick={startVoiceRecognition}
                  size="small"
                  sx={{
                    color: isListening ? 'primary.main' : 'action.active',
                  }}
                >
                  <Icon name="mic" />
                </IconButton>
                {isMobile ? (
                  <>
                    <IconButton onClick={handleClick}>
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </IconButton>
                    <Popover
                      open={openTooltipModal}
                      anchorEl={anchorTooltipModal}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          p: 2,
                          maxWidth: 200,
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                        variant="body2"
                      >
                        Clique no microfone e diga 'origem' ou 'destino' seguido
                        da cidade
                      </Typography>
                    </Popover>
                  </>
                ) : (
                  <Tooltip title="Clique no microfone e diga 'origem' ou 'destino' seguido da cidade">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                )}
              </Stack>
            </Box>

            <Autocomplete
              disablePortal
              options={filteredDestinationCities}
              value={destination}
              onInputChange={(_, value) => dispatch(setDestination(value))}
              renderInput={(params) => (
                <Input
                  {...params}
                  label="Destino"
                  variant="standard"
                  datatestId="input-destination"
                />
              )}
              sx={{ width: '100%' }}
            />
          </Stack>

          <Stack direction={'row'} spacing={2} width="100%">
            <Input
              id="date"
              label="Data ida"
              variant="standard"
              type={isIOS ? 'text' : 'date'}
              inputProps={
                isIOS
                  ? {
                      inputMode: 'numeric',
                    }
                  : undefined
              }
              value={departureDate}
              onChange={(e) => {
                isIOS
                  ? dispatch(setDepartureDate(formatDate(e.target.value)))
                  : dispatch(setDepartureDate(e.target.value));
              }}
              InputLabelProps={{ shrink: true }}
              datatestId="input-trip-date"
              fullWidth
            />

            <FormControl variant="standard" fullWidth>
              <InputLabel id="passengers-label">Passageiros</InputLabel>
              <Select
                labelId="passengers-label"
                data-testid="input-select-passengers"
                id="passengers"
                onChange={(e) =>
                  dispatch(setPassengers(Number(e.target.value)))
                }
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

          <Stack width="100%" alignItems="flex-end">
            <Button
              type="submit"
              children={loading ? 'Buscando...' : 'Buscar'}
              variant="contained"
              sx={{ textTransform: 'none', width: '100px' }}
              disabled={loading}
              dataTestId="button-trip-search"
            />
          </Stack>
        </form>

        <CustomSnackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          severity={snackbarSeverity}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
      </Box>
    </>
  );
};

export default SeachForm;
