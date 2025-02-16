import {
  Container,
  MenuItem,
  Select,
  Typography,
  TextField,
  InputLabel,
  FormControl,
  Autocomplete,
  Chip,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Input from '../../components/Input';
import useTickets from '../../hooks/useTickets';
import CustomSnackbar from '../../components/CustomSnackbar';

const amenitiesOptions = [
  'Wi-Fi',
  'Banheiro',
  'Ar condicionado',
  'Tomadas USB',
  'Água gratuita',
  'Lanches',
  'TV',
  'Cobertor e travesseiro',
];

const Admin = () => {
  const [types, setTypes] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [company, setCompany] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [price, setPrice] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<any>('success');

  const { createTicket, loading, error } = useTickets();

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ticketData = {
      origin,
      destination,
      departureDate: date,
      departureTime,
      arrivalTime,
      type: types,
      amenities: selectedAmenities,
      company,
      companyLogo,
      price,
    };

    try {
      await createTicket(ticketData);
      setSnackbarMessage('Passagem criada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setOrigin('');
      setDestination('');
      setDate('');
      setDepartureTime('');
      setArrivalTime('');
      setTypes('');
      setSelectedAmenities([]);
      setCompany('');
      setCompanyLogo('');
      setPrice('');
    } catch (err) {
      setSnackbarMessage(error || 'Erro ao criar passagem.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        boxShadow: 3,
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        maxWidth: 'sm',
      }}
      maxWidth="sm"
    >
      <Typography variant="h4" align="center" fontWeight={'bold'}>
        Cadastre novas rotas
      </Typography>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
        onSubmit={handleSubmit}
      >
        <Input
          id="origin"
          label="Cidade de origem"
          variant="outlined"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          fullWidth
        />
        <Input
          id="destination"
          label="Cidade destino"
          variant="outlined"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          fullWidth
        />
        <Input
          id="date"
          label="Data da viagem"
          variant="outlined"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <Input
          id="departure-time"
          label="Hora da partida"
          variant="outlined"
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <Input
          id="arrival-time"
          label="Hora de chegada"
          variant="outlined"
          type="time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="vehicle-type-label">Tipo de veículo</InputLabel>
          <Select
            labelId="vehicle-type-label"
            id="vehicle-type"
            value={types}
            label="Tipo de veículo"
            onChange={(e) => setTypes(e.target.value)}
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
            <MenuItem value={'Convencional'}>Convencional</MenuItem>
            <MenuItem value={'Executivo'}>Executivo</MenuItem>
            <MenuItem value={'Semi-leito'}>Semi-leito</MenuItem>
            <MenuItem value={'Leito'}>Leito</MenuItem>
            <MenuItem value={'Leito-cama'}>Leito-cama</MenuItem>
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          id="amenities"
          options={amenitiesOptions}
          value={selectedAmenities}
          onChange={(event, newValue) => {
            setSelectedAmenities(newValue);
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                style={{ margin: '2px' }}
                onDelete={() => {
                  const newAmenities = selectedAmenities.filter(
                    (item) => item !== option,
                  );
                  setSelectedAmenities(newAmenities);
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Comodidades do veículo"
              variant="outlined"
              placeholder="Selecione as comodidades"
              fullWidth
              InputProps={{
                ...params.InputProps,
                style: { paddingRight: '50px' },
              }}
            />
          )}
          fullWidth
        />

        <Input
          id="company"
          label="Nome da empresa"
          variant="outlined"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          fullWidth
        />

        <Input
          id="companyLogo"
          label="URL do logotipo da empresa"
          variant="outlined"
          value={companyLogo}
          onChange={(e) => setCompanyLogo(e.target.value)}
          fullWidth
        />

        <Input
          id="price"
          label="Preço da viagem"
          variant="outlined"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          inputProps={{
            pattern: '^\\d*\\.?\\d*$',
            title: 'O preço deve ser um número válido (ex: 100.50)',
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Enviando...' : 'Cadastrar'}
        </Button>
      </form>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </Container>
  );
};

export default Admin;
