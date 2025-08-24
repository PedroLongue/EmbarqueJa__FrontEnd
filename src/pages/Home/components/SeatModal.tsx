import { useState, useEffect, useCallback, useMemo } from 'react';
import { Typography, Modal, Box, Stack } from '@mui/material';
import Icon from '../../../assets/Icons';
import steeringwheel from '../../../assets/Icons/steeringwheel.png';
import Button from '../../../components/Button';
import useGetTicket from '../../../hooks/useGetTicket';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setSeats, setTicketId } from '../../../redux/features/searchSlice';
import useReservations from '../../../hooks/useReservation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { getSocket, disconnectSocket } from '../../../services/socket';
import React from 'react';

interface SeatModalProps {
  open: boolean;
  onClose: () => void;
  origin: string;
  destination: string;
  passengers: number;
  idTicket: string | null;
}

const rows = 12;
const seatsPerRow = 4;

const SeatButton = React.memo(
  ({
    seat,
    isSelected,
    isReserved,
    onSelect,
  }: {
    seat: number;
    isSelected: boolean;
    isReserved: boolean;
    onSelect: (seat: number) => void;
  }) => (
    <Button
      variant={isSelected ? 'contained' : 'outlined'}
      color={isReserved ? 'error' : isSelected ? 'primary' : 'inherit'}
      onClick={() => onSelect(seat)}
      disabled={isReserved}
      dataTestId={`seat-${seat}`}
      sx={{ minWidth: 'auto', px: 1 }}
    >
      <Icon name="seat" /> <small>{seat}</small>
    </Button>
  ),
);

SeatButton.displayName = 'SeatButton';

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
  const { createReservation, getPendingReservation, cancelReservation, error } =
    useReservations();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservedSeats, setReservedSeats] = useState<number[]>([]);
  const [tempReservedSeats, setTempReservedSeats] = useState<number[]>([]);
  const [socket, setSocket] = useState<any>(null);

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }, []);

  useEffect(() => {
    if (open && idTicket) {
      const socketInstance = getSocket();
      setSocket(socketInstance);

      return () => {
        if (socketInstance && idTicket) {
          socketInstance.emit('leave-ticket-room', idTicket);
        }
      };
    }
  }, [open, idTicket]);

  // Busca assentos reservados
  useEffect(() => {
    if (!idTicket || !open) return;

    const fetchReservedSeats = async () => {
      dispatch(setTicketId(idTicket));
      const data = await ticket(idTicket);
      setReservedSeats(data?.reservedSeats || []);
    };

    fetchReservedSeats();
  }, [open, idTicket, dispatch, ticket]);

  useEffect(() => {
    if (!socket || !idTicket || !currentUser) return;

    const handleSeatStatusUpdate = (data: {
      selections: Record<number, string>;
    }) => {
      const allSelections = data.selections;
      const seatsByOthers = Object.entries(allSelections)
        .filter(([_, user]) => user !== currentUser._id)
        .map(([seat]) => Number(seat));
      const seatsByCurrentUser = Object.entries(allSelections)
        .filter(([_, user]) => user === currentUser._id)
        .map(([seat]) => Number(seat));

      setTempReservedSeats(seatsByOthers);
      setSelectedSeats(seatsByCurrentUser);
    };

    socket.emit('join-ticket-room', idTicket, currentUser._id);
    socket.on('seats:update', handleSeatStatusUpdate);

    return () => {
      socket.off('seats:update', handleSeatStatusUpdate);
    };
  }, [socket, idTicket, currentUser]);

  const debouncedSocketEmit = useMemo(
    () =>
      debounce((data: any) => {
        if (socket) {
          socket.emit('seat:temp-select', data);
        }
      }, 300),
    [socket, debounce],
  );

  const clearSelection = useCallback(() => {
    if (selectedSeats.length > 0 && currentUser && idTicket && socket) {
      selectedSeats.forEach((seat) => {
        debouncedSocketEmit({
          ticketId: idTicket,
          seat,
          selected: false,
          userId: currentUser._id,
        });
      });
    }
    setSelectedSeats([]);
  }, [selectedSeats, currentUser, idTicket, socket, debouncedSocketEmit]);

  const handleReserveSeats = async () => {
    if (!idTicket || !currentUser) return;
    try {
      const hasReservation = await getPendingReservation(currentUser._id);

      if (hasReservation && hasReservation._id) {
        await cancelReservation(hasReservation._id);

        if (socket) {
          hasReservation.seats.forEach((seat: number) => {
            debouncedSocketEmit({
              ticketId: idTicket,
              seat,
              selected: false,
              userId: currentUser._id,
            });
          });
        }

        setReservedSeats([]);
        setTempReservedSeats([]);
      }

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

  const handleSelectSeat = useCallback(
    (seat: number) => {
      if (reservedSeats.includes(seat)) return;

      const isAlreadySelected = selectedSeats.includes(seat);
      const updated = isAlreadySelected
        ? selectedSeats.filter((s) => s !== seat)
        : [...selectedSeats, seat];

      if (!isAlreadySelected && updated.length > passengers) return;

      setSelectedSeats(updated);

      if (socket && idTicket && currentUser) {
        debouncedSocketEmit({
          ticketId: idTicket,
          seat,
          selected: !isAlreadySelected,
          userId: currentUser._id,
        });
      }

      if (!isAlreadySelected) {
        setTempReservedSeats((prev) => [...prev, seat]);
      } else {
        setTempReservedSeats((prev) => prev.filter((s) => s !== seat));
      }
    },
    [
      reservedSeats,
      selectedSeats,
      passengers,
      socket,
      idTicket,
      currentUser,
      debouncedSocketEmit,
    ],
  );

  const isSelected = useCallback(
    (seat: number) => selectedSeats.includes(seat),
    [selectedSeats],
  );
  const isReserved = useCallback(
    (seat: number) =>
      reservedSeats.includes(seat) || tempReservedSeats.includes(seat),
    [reservedSeats, tempReservedSeats],
  );

  const seatLayout = useMemo(() => {
    return [...Array(rows)].map((_, rowIndex) => {
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
                <SeatButton
                  key={seat}
                  seat={seat}
                  isSelected={isSelected(seat)}
                  isReserved={isReserved(seat)}
                  onSelect={handleSelectSeat}
                />
              );
            })}
          </Stack>

          <Box sx={{ width: { xs: 16, sm: 40 } }} />

          <Stack direction="row" spacing={1}>
            {[2, 3].map((i) => {
              const seat = seatStart + i;
              return (
                <SeatButton
                  key={seat}
                  seat={seat}
                  isSelected={isSelected(seat)}
                  isReserved={isReserved(seat)}
                  onSelect={handleSelectSeat}
                />
              );
            })}
          </Stack>
        </Box>
      );
    });
  }, [isSelected, isReserved, handleSelectSeat]);

  const handleClose = useCallback(() => {
    onClose();
    clearSelection();
  }, [onClose, clearSelection]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="seat-modal-title"
      aria-describedby="seat-modal-description"
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
        data-testid="modal-seat"
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          id="seat-modal-title"
        >
          Mapa de assentos:
        </Typography>

        <Typography
          variant="body1"
          align="center"
          mb={2}
          display="flex"
          justifyContent="center"
          id="seat-modal-description"
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
            <img
              src={steeringwheel}
              alt="Volante"
              loading="lazy"
              style={{ width: 40 }}
            />
          </Box>

          <Stack spacing={2}>{seatLayout}</Stack>
        </Box>

        <Typography
          variant="body1"
          mt={2}
          align="center"
          data-testid="selected-seats"
        >
          Assentos Selecionados: {selectedSeats.join(', ') || 'Nenhum'}
        </Typography>

        <Stack>
          <Button
            variant="contained"
            sx={{ margin: '10px auto 0px' }}
            disabled={selectedSeats.length === 0}
            onClick={() => {
              handleReserveSeats();
            }}
            dataTestId="confirm-seats-button"
          >
            Confirmar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default React.memo(SeatModal);
