import {
  Box,
  CircularProgress,
  Container,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Icon from '../../assets/Icons';
import TicketTime from '../TicketTime';
import Button from '../Button';
import { useEffect, useState } from 'react';
import SeatModal from './components/SeatModal';
import { useNavigate } from 'react-router';
import CustomSnackbar from '../CustomSnackbar';
import { SnackbarSeverity } from '../../types';

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('error');

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);

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

  const validTickets = tickets
    .filter((ticket) => {
      const ticketDate = new Date(ticket.departureDate);
      ticketDate.setHours(ticketDate.getHours() + 3);
      return ticketDate >= now;
    })
    .sort((a, b) => {
      const [hoursA, minutesA] = a.departureTime.split(':').map(Number);
      const [hoursB, minutesB] = b.departureTime.split(':').map(Number);

      const dateA = new Date(a.departureDate);
      dateA.setHours(hoursA, minutesA, 0, 0);

      const dateB = new Date(b.departureDate);
      dateB.setHours(hoursB, minutesB, 0, 0);

      return dateA.getTime() - dateB.getTime();
    });

  const [page, setPage] = useState(1);
  const ticketsPerPage = 4;

  const startIndex = (page - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = validTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(validTickets.length / ticketsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container sx={{ marginTop: '152px' }} maxWidth="md">
      {loading && (
        <Typography
          variant="body1"
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={2}
          fontWeight={'bold'}
        >
          Buscando passagens <CircularProgress size={24} />
        </Typography>
      )}

      {!loading && !error && validTickets.length > 0 && (
        <>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {validTickets.length} resultados para {origin} <Icon name="arrow" />{' '}
            {destination}
          </Typography>
          {currentTickets.map((ticket) => (
            <Box
              key={ticket._id}
              sx={{
                boxShadow: 3,
                background: '#fff',
                padding: 3,
                borderRadius: 2,
                marginBottom: 5,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  alignItems: { md: 'flex-start', xs: 'center' },
                }}
              >
                {' '}
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Icon name="location" /> {ticket.origin} <Icon name="arrow" />{' '}
                  {ticket.destination}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Icon name="seat" /> {ticket.type}
                </Typography>
                <TicketTime
                  ticket={{
                    departureTime: `${ticket.departureTime}`,
                    arrivalTime: `${ticket.arrivalTime}`,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { md: 'flex-start', xs: 'center' },
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    maxWidth: { md: 350 },
                    flexWrap: 'wrap',
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
                </Box>
              </Stack>
              <Box
                sx={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={ticket.companyLogo}
                  alt={ticket.origin}
                  sx={{
                    width: { xs: 100, md: 150 },
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </Box>

              <Stack
                spacing={1}
                alignItems={'center'}
                sx={{ minWidth: '120px' }}
              >
                <Typography variant="h6" fontWeight="bold">
                  R$ {String(ticket.price).replace('.', ',')}
                </Typography>
                <Button
                  type="button"
                  children="Selecionar"
                  variant="contained"
                  onClick={() => handleOpenSeatModal(ticket._id)}
                  sx={{ textTransform: 'none', width: '100%' }}
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
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </Container>
  );
};

export default RenderTickets;
