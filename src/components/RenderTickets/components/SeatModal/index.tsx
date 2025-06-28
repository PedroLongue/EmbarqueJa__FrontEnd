import { useState, useEffect } from 'react';
import { Typography, Modal, Box, Stack } from '@mui/material';
import Icon from '../../../../assets/Icons';
import steeringwheel from '../../../../assets/Icons/steeringwheel.png';
import Button from '../../../Button';
import useGetTicket from '../../../../hooks/useGetTicket';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { setSeats, setTicketId } from '../../../../redux/features/searchSlice';
import useReservations from '../../../../hooks/useReservation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import socket from '../../../../services/socket';

interface SeatModalProps {
  open: boolean;
  onClose: () => void;
  origin: string;
  destination: string;
  passengers: number;
  idTicket: string | null;
}

const rows = 12; // Total: 12 linhas × 4 assentos = 48 lugares
const seatsPerRow = 4;

const SeatModal: React.FC<SeatModalProps> = ({
  open,
  onClose,
  origin,
  destination,
  passengers,
  idTicket,
}) => {
  const navigate = useNavigate();
  const { ticket } = useGetTicket();
  const dispatch = useAppDispatch();
  const { createReservation, error } = useReservations();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservedSeats, setReservedSeats] = useState<number[]>([]);
  const [tempReservedSeats, setTempReservedSeats] = useState<number[]>([]);

  useEffect(() => {
    if (!idTicket) return;

    const fetchReservedSeats = async () => {
      dispatch(setTicketId(idTicket));
      const data = await ticket(idTicket);
      setReservedSeats(data?.reservedSeats || []);
    };

    if (open) fetchReservedSeats();

    const handleSeatStatusUpdate = (data: {
      selections: Record<number, string>;
    }) => {
      const allSelections = data.selections;
      const seatsByOthers = Object.entries(allSelections)
        .filter(([_, user]) => user !== currentUser?._id)
        .map(([seat]) => Number(seat));
      const seatsByCurrentUser = Object.entries(allSelections)
        .filter(([_, user]) => user === currentUser?._id)
        .map(([seat]) => Number(seat));

      setTempReservedSeats(seatsByOthers);
      setSelectedSeats(seatsByCurrentUser);
    };

    socket.emit('join-ticket-room', idTicket, currentUser?._id);
    socket.on('seats:update', handleSeatStatusUpdate);

    return () => {
      socket.off('seats:update', setSelectedSeats);
      socket.emit('leave-ticket-room', idTicket);
    };
  }, [open, idTicket]);

  const clearSelection = () => {
    if (selectedSeats.length > 0 && currentUser && idTicket) {
      selectedSeats.forEach((seat) => {
        socket.emit('seat:temp-select', {
          ticketId: idTicket,
          seat,
          selected: false,
          userId: currentUser._id,
        });
      });
    }
    setSelectedSeats([]);
  };

  const handleReserveSeats = async () => {
    if (!idTicket || !currentUser) return;
    try {
      await createReservation(currentUser._id, idTicket, selectedSeats);
      dispatch(setSeats(selectedSeats));
      setSelectedSeats([]);
      if (!error) {
        navigate('/preview-ticket');
        onClose();
      }
    } catch (err) {
      console.error('Erro ao reservar:', err);
    }
  };

  const handleSelectSeat = (seat: number) => {
    if (reservedSeats.includes(seat)) return;

    const isAlreadySelected = selectedSeats.includes(seat);
    const updated = isAlreadySelected
      ? selectedSeats.filter((s) => s !== seat)
      : [...selectedSeats, seat];

    if (!isAlreadySelected && updated.length > passengers) return;

    setSelectedSeats(updated);

    socket.emit('seat:temp-select', {
      ticketId: idTicket,
      seat,
      selected: !isAlreadySelected,
      userId: currentUser?._id,
    });
  };

  const isSelected = (seat: number) => selectedSeats.includes(seat);
  const isReserved = (seat: number) =>
    reservedSeats.includes(seat) || tempReservedSeats.includes(seat);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        clearSelection();
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          maxWidth: 600,
          width: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Mapa de assentos:
        </Typography>

        <Typography
          variant="body1"
          align="center"
          mb={2}
          display="flex"
          justifyContent="center"
        >
          <Icon name="location" /> {origin} <Icon name="arrow" /> {destination}
        </Typography>

        <Box
          sx={{
            border: '1px solid #000',
            borderRadius: 2,
            padding: 2,
            maxWidth: { xs: '100%', sm: 400 },
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src={steeringwheel} style={{ width: 40 }} />
          </Box>

          <Stack spacing={2}>
            {[...Array(rows)].map((_, rowIndex) => {
              const seatStart = rowIndex * seatsPerRow + 1;

              return (
                <Box
                  key={rowIndex}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    gap: { xs: '1px', sm: '24px' },
                  }}
                >
                  {/* Assentos lado esquerdo */}
                  <Stack direction="row" spacing={1}>
                    {[0, 1].map((i) => {
                      const seat = seatStart + i;
                      return (
                        <Button
                          key={seat}
                          dataTestId={`seat-${seat}`}
                          variant={isSelected(seat) ? 'contained' : 'outlined'}
                          color={
                            isReserved(seat)
                              ? 'error'
                              : isSelected(seat)
                                ? 'primary'
                                : 'inherit'
                          }
                          onClick={() => handleSelectSeat(seat)}
                          disabled={isReserved(seat)}
                        >
                          <Icon name="seat" /> <small>{seat}</small>
                        </Button>
                      );
                    })}
                  </Stack>

                  <Box sx={{ width: { xs: 16, sm: 40 } }} />

                  <Stack direction="row" spacing={1}>
                    {[2, 3].map((i) => {
                      const seat = seatStart + i;
                      return (
                        <Button
                          key={seat}
                          variant={isSelected(seat) ? 'contained' : 'outlined'}
                          color={
                            isReserved(seat)
                              ? 'error'
                              : isSelected(seat)
                                ? 'primary'
                                : 'inherit'
                          }
                          onClick={() => handleSelectSeat(seat)}
                          disabled={isReserved(seat)}
                          dataTestId={`seat-${seat}`}
                        >
                          <Icon name="seat" /> <small>{seat}</small>
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>

        <Typography variant="body1" mt={2} align="center">
          Assentos Selecionados: {selectedSeats.join(', ') || 'Nenhum'}
        </Typography>

        <Stack>
          <Button
            children={'Confirmar'}
            variant="contained"
            sx={{ margin: '10px auto 0px' }}
            disabled={selectedSeats.length === 0}
            onClick={() => {
              handleReserveSeats();
            }}
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default SeatModal;
