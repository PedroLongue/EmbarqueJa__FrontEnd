import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Icon from '../../assets/Icons';
import { Typography } from '@mui/material';

dayjs.extend(duration);
dayjs.extend(customParseFormat);

const formatDuration = (departureTime: string, arrivalTime: string) => {
  const departure = dayjs(departureTime, 'HH:mm');
  const arrival = dayjs(arrivalTime, 'HH:mm');

  if (!departure.isValid() || !arrival.isValid()) {
    console.error('Erro: Formato de hora inválido.', {
      departureTime,
      arrivalTime,
    });
    return 'Hora inválida';
  }

  let diffMinutes = arrival.diff(departure, 'minute');
  if (diffMinutes < 0) diffMinutes += 24 * 60;

  const tripDuration = dayjs.duration(diffMinutes, 'minutes');
  const hours = tripDuration.hours();
  const minutes = tripDuration.minutes();

  return `${hours}h ${minutes}min`;
};

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
