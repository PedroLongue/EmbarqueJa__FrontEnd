import Icon from '../../assets/Icons';
import { Typography } from '@mui/material';
import { formatDuration } from '../../utils/formatDate';

const TicketTime = ({
  ticket,
}: {
  ticket: { departureTime: string; arrivalTime: string };
}) => {
  return (
    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
      <Icon name="time" />
      {ticket.departureTime} <Icon name="arrow" /> {ticket.arrivalTime}
      {'  '}({formatDuration(ticket.departureTime, ticket.arrivalTime)})
    </Typography>
  );
};

export default TicketTime;
