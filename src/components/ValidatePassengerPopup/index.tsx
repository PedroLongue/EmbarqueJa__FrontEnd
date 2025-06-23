import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import {
  Box,
  Modal,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../services/api';
import Button from '../Button';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ValidatePassengerPopup: React.FC<Props> = ({ open, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadModels = async () => {
      setLoading(true);
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition'),
      ]);
      setLoading(false);
    };

    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };

    loadModels().then(startVideo);

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setResult(null);
      setError('');
    };
  }, [open]);

  const handleValidate = async () => {
    setError('');
    setResult(null);
    setValidating(true);
    try {
      const options = new faceapi.TinyFaceDetectorOptions();
      const detection = await faceapi
        .detectSingleFace(videoRef.current!, options)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setError('Rosto não detectado. Tente novamente.');
        return;
      }

      const descriptor = Array.from(detection.descriptor);
      const token = localStorage.getItem('@Auth:token');

      const res = await api.post(
        '/face-passengers/admin-validate',
        { descriptor },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro inesperado.');
    } finally {
      setValidating(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setError('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          width: '90%',
          maxWidth: 500,
          textAlign: 'center',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Validação Facial</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!result && (
          <>
            <video
              ref={videoRef}
              playsInline
              width="100%"
              height="auto"
              style={{
                borderRadius: 8,
                objectFit: 'cover',
                marginBottom: 16,
                border: '1px solid #ccc',
              }}
            />

            <Button
              onClick={handleValidate}
              variant="contained"
              fullWidth
              disabled={loading || validating}
              children={
                loading ? (
                  'Carregando modelos...'
                ) : validating ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Validando...
                  </>
                ) : (
                  'Validar passageiro'
                )
              }
            />
          </>
        )}

        {result && (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Passageiro reconhecido com sucesso!
            </Alert>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} sx={{ textAlign: 'left', mb: 2 }}>
              <Typography>
                <strong>Nome:</strong> {result.name}
              </Typography>
              <Typography>
                <strong>CPF:</strong> {result.cpf}
              </Typography>
              <Typography>
                <strong>Origem:</strong> {result.origin}
              </Typography>
              <Typography>
                <strong>Destino:</strong> {result.destination}
              </Typography>
              <Typography>
                <strong>Horário:</strong> {result.departureTime}
              </Typography>
              <Typography>
                <strong>Empresa:</strong> {result.company}
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ValidatePassengerPopup;
