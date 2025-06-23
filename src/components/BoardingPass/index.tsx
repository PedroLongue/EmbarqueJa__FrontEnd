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
import { useNavigate } from 'react-router';
import { ITicket } from '../../types';
interface IBoardingPass {
  ticket: ITicket;
  onCancel: () => void;
  isFormValid: boolean;
  loadingImage: boolean;
}

const BoardingPass = ({
  ticket,
  onCancel,
  isFormValid,
  loadingImage,
}: IBoardingPass) => {
  const passengerSeats = useSelector((state: RootState) => state.search.seats);
  const passengers = useSelector((state: RootState) => state.search.passengers);

  const navigate = useNavigate();

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
              {ticket.origin} <Icon name="arrow" /> {ticket.destination}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Icon name="time" />
            <Typography ml={1} display={'flex'}>
              {ticket.departureTime} <Icon name="arrow" /> {ticket.arrivalTime}
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
              R$ {ticket.price}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Stack gap={2}>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => {
            navigate('/checkout');
          }}
          disabled={!isFormValid || loadingImage}
          children="Ir para o pagamento"
        />
        <Button
          variant="contained"
          onClick={onCancel}
          disabled={loadingImage}
          color="error"
          children="Cancelar reserva"
        />
      </Stack>
    </Grid>
  );
};

export default BoardingPass;
