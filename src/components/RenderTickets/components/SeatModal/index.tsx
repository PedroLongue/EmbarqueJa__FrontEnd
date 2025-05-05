import { useState, useEffect } from 'react';
import { Grid, Typography, Modal, Box, Stack } from '@mui/material';
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

const rows: number = 10;
const seatsPerRow: number = 4;

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

    if (open) {
      fetchReservedSeats();
    }
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

  const handleReserveSeats = async () => {
    if (!idTicket) return;

    try {
      if (currentUser) {
        await createReservation(currentUser._id, idTicket, selectedSeats);
      }
      dispatch(setSeats(selectedSeats));
      setSelectedSeats([]);

      if (!error) {
        navigate('/preview-ticket');
        onClose();
      }
    } catch (err) {
      console.error('Error during reservation:', err);
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

  const isSelected = (seat: number): boolean => selectedSeats.includes(seat);

  const isReserved = (seat: number): boolean =>
    reservedSeats.includes(seat) || tempReservedSeats.includes(seat);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h4" align="center">
          Mapa de assentos:
        </Typography>
        <Typography
          variant="body1"
          align="center"
          marginBottom={2}
          display={'flex'}
          justifyContent={'center'}
        >
          <Icon name="location" /> {origin} <Icon name="arrow" /> {destination}
        </Typography>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          width="380px"
          sx={{
            border: '1px solid #000',
            margin: '0 auto',
            borderRadius: 2,
            padding: '10px 0px',
          }}
        >
          <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
            <img src={steeringwheel} />
          </Box>

          {[...Array(rows)].map((_, rowIndex) => (
            <Grid
              key={rowIndex}
              container
              item
              spacing={1}
              justifyContent="center"
            >
              {[...Array(seatsPerRow)].map((_, seatIndex) => {
                const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
                const disabled = isReserved(seatNumber);

                return (
                  <>
                    <Grid
                      item
                      key={seatNumber}
                      sx={{
                        paddingLeft: '0px !important',
                        paddingTop: '30px !important',
                      }}
                    >
                      <Button
                        variant={
                          isSelected(seatNumber) ? 'contained' : 'outlined'
                        }
                        color={
                          isReserved(seatNumber)
                            ? 'error'
                            : isSelected(seatNumber)
                              ? 'primary'
                              : 'default'
                        }
                        onClick={() => handleSelectSeat(seatNumber)}
                        disabled={disabled}
                      >
                        <Icon name="seat" /> <small>{seatNumber}</small>
                      </Button>
                    </Grid>
                    {seatIndex === 1 && (
                      <Grid
                        item
                        key={`corridor-${rowIndex}`}
                        sx={{ width: '50px' }}
                      ></Grid>
                    )}
                  </>
                );
              })}
            </Grid>
          ))}
        </Grid>

        <Typography variant="body1" marginTop={2} align="center">
          Assentos Selecionados: {selectedSeats.join(', ') || 'Nenhum'}
        </Typography>

        <Stack>
          <Button
            children={'Confirmar'}
            variant="contained"
            sx={{ margin: '10px auto 0px' }}
            disabled={selectedSeats.length === 0}
            onClick={handleReserveSeats}
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default SeatModal;
