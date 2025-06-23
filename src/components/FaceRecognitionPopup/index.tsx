import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import {
  Box,
  IconButton,
  Modal,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../services/api';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  getCurrentUser,
  loadCurrentUser,
} from '../../redux/features/authSlice';
import CustomSnackbar from '../CustomSnackbar';
import Button from '../Button';
import theme from '../../theme';

interface FaceRecognitionPopupProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'register' | 'login';
}

const steps = [
  'Detectar rosto',
  'Aproxime-se da câmera',
  'Levante as sobrancelhas',
];

const FaceRecognitionPopup: React.FC<FaceRecognitionPopupProps> = ({
  open,
  onClose,
  onSuccess,
  mode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [refDetection, setRefDetection] = useState<faceapi.WithFaceDescriptor<
    faceapi.WithFaceLandmarks<
      { detection: faceapi.FaceDetection },
      faceapi.FaceLandmarks68
    >
  > | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!open) return;

    const loadModels = async () => {
      setLoading(true);
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression'),
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
    };
  }, [open]);

  const showError = (message: string) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const handleDetect = async () => {
    if (!videoRef.current) return;
    setDetecting(true);
    const options = new faceapi.TinyFaceDetectorOptions();

    try {
      switch (currentStep) {
        case 0: {
          const detection = await faceapi
            .detectSingleFace(videoRef.current, options)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!detection)
            return showError(
              'Rosto não detectado. Centralize seu rosto na câmera.',
            );

          setRefDetection(detection);
          setCurrentStep(1);
          break;
        }

        case 1: {
          await new Promise((r) => setTimeout(r, 2000));

          const detection = await faceapi
            .detectSingleFace(videoRef.current, options)
            .withFaceLandmarks()
            .withFaceExpressions();

          if (!detection)
            return showError('Rosto não detectado. Tente novamente.');

          const area1 = refDetection!.detection.box.area;
          const area2 = detection.detection.box.area;
          const growth = area2 / area1;

          if (growth < 1.15)
            return showError('Aproxime um pouco mais o rosto da câmera.');

          setCurrentStep(2);
          break;
        }

        case 2: {
          await new Promise((r) => setTimeout(r, 2000));

          const detection = await faceapi
            .detectSingleFace(videoRef.current, options)
            .withFaceLandmarks()
            .withFaceExpressions();

          if (!detection?.expressions)
            return showError('Rosto não detectado. Tente novamente.');

          const surprised = detection.expressions.surprised ?? 0;

          if (surprised < 0.7)
            return showError(
              'Expressão de surpresa não detectada. Levante as sobrancelhas e arregale os olhos.',
            );

          const descriptor = Array.from(refDetection!.descriptor);

          if (mode === 'register') {
            const token = localStorage.getItem('@Auth:token');
            await api.post(
              '/users/register-face',
              { descriptor },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            await dispatch(getCurrentUser());
            setSnackbar({
              open: true,
              message: 'Rosto cadastrado com sucesso!',
              severity: 'success',
            });
          } else {
            const res = await api.post('/users/login-face', { descriptor });
            localStorage.setItem('@Auth:token', res.data.token);
            api.defaults.headers.common['Authorization'] =
              `Bearer ${res.data.token}`;
            await dispatch(getCurrentUser());
            dispatch(loadCurrentUser());
            setSnackbar({
              open: true,
              message: 'Login realizado com sucesso!',
              severity: 'success',
            });
            navigate('/');
          }

          onSuccess?.();
          onClose();
          break;
        }
      }
    } catch {
      showError('Erro inesperado na verificação facial.');
    } finally {
      setDetecting(false);
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
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
            maxHeight: '80vh',
            overflowY: 'auto',
            textAlign: 'center',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {mode === 'register'
                ? 'Cadastro de FaceRecognition'
                : 'Login com FaceRecognition'}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="subtitle1" fontWeight={500} mb={1}>
            Siga a instrução: <strong>{steps[currentStep]}</strong>
          </Typography>

          <video
            ref={videoRef}
            playsInline
            width="100%"
            height="auto"
            style={{
              borderRadius: 8,
              height: isMobile ? '30vh' : 'auto',
              objectFit: 'cover',
            }}
          />

          <Box mt={2}>
            <Button
              onClick={() => {
                handleDetect();
              }}
              disabled={loading || detecting}
              variant="contained"
            >
              {loading ? (
                'Carregando modelos...'
              ) : detecting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Detectando...
                </>
              ) : mode === 'register' ? (
                'Detectar e Cadastrar'
              ) : (
                'Detectar e Entrar'
              )}
            </Button>
          </Box>
        </Box>
      </Modal>

      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity as any}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </>
  );
};

export default FaceRecognitionPopup;
