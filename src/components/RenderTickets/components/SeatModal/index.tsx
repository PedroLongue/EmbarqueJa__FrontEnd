import { useState, useEffect } from 'react';
import { Grid, Typography, Modal, Box, Stack } from '@mui/material';
import Icon from '../../../../assets/Icons';
import steeringwheel from '../../../../assets/Icons/steeringwheel.png';
import Button from '../../../Button';
import useTicketReservation from '../../../../hooks/useTicketReservation';
import useGetTicket from '../../../../hooks/useGetTicket';

interface SeatModalProps {
  open: boolean;
  onClose: () => void;
  origin: string;
  destination: string;
  passengers: number;
  idTicket: string;
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
  const { reserveSeats, loading, error, success } = useTicketReservation();
  const { ticket } = useGetTicket();

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservedSeats, setReservedSeats] = useState<number[]>([]);

  useEffect(() => {
    const fetchReservedSeats = async () => {
      if (idTicket) {
        const data = await ticket(idTicket);
        setReservedSeats(data?.reservedSeats || []);
      }
    };

    if (open) {
      fetchReservedSeats();
    }
  }, [open, idTicket]);

  const handleReserveSeats = async () => {
    if (!idTicket) return;
    await reserveSeats(idTicket, selectedSeats);

    if (success) {
      setSelectedSeats([]);
      onClose();
    }
  };

  const handleSelectSeat = (seat: number) => {
    if (reservedSeats.includes(seat)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seat)) {
        return prev.filter((s) => s !== seat);
      }
      if (prev.length < passengers) {
        return [...prev, seat];
      }
      return prev;
    });
  };

  const isSelected = (seat: number): boolean => selectedSeats.includes(seat);

  const isReserved = (seat: number): boolean => reservedSeats.includes(seat);

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
