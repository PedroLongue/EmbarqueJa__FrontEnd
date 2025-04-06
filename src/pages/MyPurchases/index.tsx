import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import useGetTicket from '../../hooks/useGetTicket';
import Icon from '../../assets/Icons';
import { formatDateToDDMMYYYY } from '../../utils/formatDate';
import { EmptyStatePurchases } from '../../assets/imgs/emptyStatePurchases';

type Ticket = {
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
  reservedSeats: number[];
  userSeats: number[];
};

const MyPurchases = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { ticket } = useGetTicket();

  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const results: Ticket[] = await Promise.all(
          currentUser?.userTickets?.map(async (userTicket: any) => {
            const fullTicket = await ticket(userTicket.ticketId);
            return {
              ...fullTicket,
              userSeats: userTicket.userSeats || [],
            };
          }) || [],
        );
        setTicketsData(results);
      } catch (err) {
        console.error('Erro ao buscar passagens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentUser]);

  return (
    <Container
      sx={{
        flex: '1',
        mt: 4,
      }}
      maxWidth="lg"
    >
      <Typography variant="h4" gutterBottom>
        Minhas Compras:
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!ticketsData.length ? (
            <EmptyStatePurchases />
          ) : (
            <>
              {ticketsData.map((ticket) => (
                <Card sx={{ borderRadius: 2, boxShadow: 3, marginBottom: 2 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" gutterBottom>
                        Resumo da compra:
                      </Typography>
                      <Divider
                        sx={{
                          backgroundColor: '#4A90E2',
                          height: '2px',
                          marginBottom: '10px',
                        }}
                      />
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
                    <Box
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Stack>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Icon name="location" />
                          <Typography fontWeight="bold" ml={1} display={'flex'}>
                            {ticket.origin} <Icon name="arrow" />{' '}
                            {ticket.destination}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Icon name="time" />
                          <Typography ml={1} display={'flex'}>
                            {ticket.departureTime} <Icon name="arrow" />{' '}
                            {ticket.arrivalTime}
                          </Typography>
                        </Box>
                        {ticket.userSeats.map((seat: number) => (
                          <Typography key={seat} display={'flex'}>
                            <Icon name="seat" />
                            <span style={{ marginLeft: '8px' }}>
                              Poltrona {seat}
                            </span>
                          </Typography>
                        ))}
                      </Stack>
                      <Stack
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <img
                          src={ticket?.companyLogo}
                          alt="Logo da empresa"
                          style={{ height: 40 }}
                        />
                        <Typography variant="h5" fontWeight="bold">
                          R$ {ticket.price}
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default MyPurchases;
