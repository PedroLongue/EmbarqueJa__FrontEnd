import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useGetTicket from '../../hooks/useGetTicket';
import BoardingPass from '../../components/BoardingPass';
import CheckoutForm from '../../components/CheckoutForm';

interface ITicket {
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
}

const PreviewTicket = () => {
  const { ticket } = useGetTicket();

  const ticketId = useSelector((state: RootState) => state.search.ticketId);

  const [userTicket, setUserTicket] = useState<ITicket | null>();

  const getTicket = async () => {
    const data = await ticket(ticketId);
    setUserTicket(data);
  };

  useEffect(() => {
    getTicket();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, flex: 1 }}>
      <Grid container spacing={4}>
        <CheckoutForm />
        {userTicket && <BoardingPass ticket={userTicket} />}
      </Grid>
    </Container>
  );
};

export default PreviewTicket;
