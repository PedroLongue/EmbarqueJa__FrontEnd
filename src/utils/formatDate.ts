import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(duration);
dayjs.extend(customParseFormat);

export const formatDateToDDMMYYYY = (isoDate: string) => {
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

export const formatDuration = (departureTime: string, arrivalTime: string) => {
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
