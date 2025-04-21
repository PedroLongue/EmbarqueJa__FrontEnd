import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Icon from '../../assets/Icons';
import TicketTime from '../TicketTime';
import Button from '../Button';
import { useState } from 'react';
import SeatModal from './components/SeatModal';
import { useNavigate } from 'react-router';

export const amenityToIcon: Record<
  string,
  'wc' | 'air' | 'seat' | 'usb' | 'water' | 'snack' | 'tv' | 'bed' | 'wifi'
> = {
  'Banheiro': 'wc',
  'Ar condicionado': 'air',
  'Assento reclinável': 'seat',
  'Tomadas USB': 'usb',
  'Água gratuita': 'water',
  'Lanches': 'snack',
  'TV': 'tv',
  'Cobertor e travesseiro': 'bed',
  'Wi-Fi': 'wifi',
};

const RenderTickets = () => {
  const navigate = useNavigate();
  const { signed } = useSelector((state: RootState) => state.auth);
  const { tickets, loading, error, origin, destination } = useSelector(
    (state: RootState) => state.search,
  );

  const [openSeatModal, setOpenSeatModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const handleOpenSeatModal = (id: string) => {
    if (!signed) {
      navigate('/login');
      return;
    }
    setOpenSeatModal(true);
    setSelectedTicketId(id);
  };
  const handleCloseSeatModal = () => {
    setOpenSeatModal(false);
    setSelectedTicketId(null);
  };

  const passengers = useSelector((state: RootState) => state.search.passengers);

  const now = new Date();

  const validTickets = tickets.filter((ticket) => {
    const ticketDate = new Date(ticket.departureDate);
    ticketDate.setHours(ticketDate.getHours() + 3);
    return ticketDate >= now;
  });

  console.log({ tickets });
  return (
    <Container sx={{ marginTop: '152px' }} maxWidth="md">
      {loading && (
        <Typography variant="h5">
          Buscando passagens <CircularProgress />
        </Typography>
      )}
      {error && (
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      )}

      {!loading && !error && validTickets.length > 0 && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {validTickets.length} resultados para {origin} <Icon name="arrow" />{' '}
            {destination}
          </Typography>
          {validTickets.map((ticket) => (
            <Box
              key={ticket.id}
              sx={{
                background: '#fff',
              }}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              padding={2}
              borderRadius={2}
              marginBottom={5}
            >
              <Stack spacing={2}>
                {' '}
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Icon name="location" /> {ticket.origin} <Icon name="arrow" />{' '}
                  {ticket.destination}
                </Typography>
                <TicketTime
                  ticket={{
                    departureTime: `${ticket.departureTime}`,
                    arrivalTime: `${ticket.arrivalTime}`,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  {ticket?.amenities?.map((amenity, idx) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Icon name={amenityToIcon[amenity]} />
                      {amenity}
                    </Typography>
                  ))}
                </div>
              </Stack>
              <Stack>
                <img src={ticket.companyLogo} alt={ticket.origin} width={250} />
              </Stack>
              <Stack
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <Typography
                  variant="h5"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  fontWeight={'bold'}
                >
                  R$ {String(ticket.price).replace('.', ',')}
                </Typography>
                <Button
                  type="submit"
                  children={'Selecionar'}
                  variant="contained"
                  onClick={() => handleOpenSeatModal(ticket._id)}
                  sx={{ textTransform: 'none', width: '150px' }}
                />
              </Stack>
              <SeatModal
                open={openSeatModal}
                onClose={handleCloseSeatModal}
                origin={ticket.origin}
                destination={ticket.destination}
                passengers={passengers}
                idTicket={selectedTicketId}
              />
            </Box>
          ))}
        </>
      )}
    </Container>
  );
};

export default RenderTickets;
