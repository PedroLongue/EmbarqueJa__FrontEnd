import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Icon from '../../assets/Icons';
import Button from '../Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDateToDDMMYYYY } from '../../utils/formatDate';
interface ITicket {
  ticket: {
    _id: string;
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    type: string;
    amenities: string[];
    company: string;
    companyLogo: string;
    price: number;
    __v: number;
    reservedSeats: number[];
  };
}

const BoardingPass = ({ ticket }: ITicket) => {
  const passengerSeats = useSelector((state: RootState) => state.search.seats);
  const passengers = useSelector((state: RootState) => state.search.passengers);

  return (
    <Grid item xs={12} md={5}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" gutterBottom>
              Resumo da compra:
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              display={'flex'}
              alignItems={'center'}
            >
              <Icon name="calendar" />{' '}
              {ticket?.departureDate &&
                formatDateToDDMMYYYY(ticket.departureDate)}
            </Typography>
          </Stack>
          <Divider
            sx={{
              backgroundColor: '#4A90E2',
              height: '2px',
              marginBottom: '10px',
            }}
          />
          <Box display="flex" alignItems="center" mb={1}>
            <Icon name="location" />
            <Typography fontWeight="bold" ml={1} display={'flex'}>
              Nova Friburgo <Icon name="arrow" /> Rio de Janeiro
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Icon name="time" />
            <Typography ml={1} display={'flex'}>
              10:00 <Icon name="arrow" /> 13:00
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Icon name="person" />
            <Typography ml={1}>{passengers} Passageiro(s)</Typography>
          </Box>
          {passengerSeats.map((seat: number) => (
            <Typography key={seat} display={'flex'}>
              <Icon name="seat" />
              <span style={{ marginLeft: '8px' }}>Poltrona {seat}</span>
            </Typography>
          ))}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <img
              src={ticket?.companyLogo}
              alt="Logo da empresa"
              style={{ height: 40 }}
            />
            <Typography variant="h5" fontWeight="bold">
              R$ 52,02
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Button variant="contained" fullWidth sx={{ mt: 3 }}>
        Ir para o pagamento
      </Button>
    </Grid>
  );
};

export default BoardingPass;
