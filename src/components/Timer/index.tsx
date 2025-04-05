import { Box, Tooltip, Typography } from '@mui/material';
import Icon from '../../assets/Icons';
import { useEffect, useState } from 'react';

interface ITimerProps {
  onCancel: () => void;
}

const Timer = ({ onCancel }: ITimerProps) => {
  const [timeLeft, setTimeLeft] = useState(6000);

  useEffect(() => {
    if (timeLeft <= 0) {
      onCancel();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Tooltip
      title="A reserva será cancelada automaticamente quando o tempo acabar."
      placement="top"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '10px',
          borderRadius: '8px',
          textAlign: 'center',
          justifyContent: 'center',
          width: 'fit-content',
          marginBottom: 2,
        }}
      >
        <Icon name="time" />
        <Typography variant="h6" fontWeight="bold">
          Tempo restante: {formatTime(timeLeft)}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default Timer;
