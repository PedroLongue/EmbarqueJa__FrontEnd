import { IconButton, Popover, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface Props {
  isMobile: boolean;
  onIconClick: (event: React.MouseEvent<HTMLElement>) => void;
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const VoiceTooltip = ({
  isMobile,
  onIconClick,
  open,
  anchorEl,
  onClose,
}: Props) => {
  const content = (
    <>
      Você pode preencher os campos por voz. Comandos disponíveis:
      <br />
      • origem [cidade]
      <br />
      • destino [cidade]
      <br />
      • data [dia] de [mês] — exemplo: \"data 10 de julho\"
      <br />
      • passageiros [1 a 5] — exemplo: \"passageiros três\"
      <br />• buscar
    </>
  );

  return isMobile ? (
    <>
      <IconButton onClick={onIconClick}>
        <InfoOutlinedIcon fontSize="small" color="action" />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Typography
          sx={{
            p: 2,
            maxWidth: 300,
            fontSize: '12px',
            fontWeight: 'bold',
            lineHeight: 1.6,
          }}
        >
          {content}
        </Typography>
      </Popover>
    </>
  ) : (
    <Tooltip title={content}>
      <InfoOutlinedIcon fontSize="small" color="action" />
    </Tooltip>
  );
};

export default VoiceTooltip;
