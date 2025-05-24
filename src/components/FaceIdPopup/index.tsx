import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Box, IconButton, Modal, Typography } from '@mui/material';
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

interface FaceIdPopupProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'register' | 'login';
}

const FaceIdPopup: React.FC<FaceIdPopupProps> = ({
  open,
  onClose,
  onSuccess,
  mode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<any>('error');

  useEffect(() => {
    if (!open) return;

    const loadModels = async () => {
      setLoading(true);
      await faceapi.nets.tinyFaceDetector.loadFromUri(
        '/models/tiny_face_detector',
      );
      await faceapi.nets.faceLandmark68Net.loadFromUri(
        '/models/face_landmark_68',
      );
      await faceapi.nets.faceRecognitionNet.loadFromUri(
        '/models/face_recognition',
      );

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

  const handleDetect = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setSnackbarMessage('Rosto não detectado!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    try {
      if (mode === 'register') {
        const token = localStorage.getItem('@Auth:token');
        await api.post(
          '/users/faceid',
          { descriptor },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        await dispatch(getCurrentUser());
        setSnackbarMessage('FaceID cadastrado com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        const res = await api.post('/users/login-faceid', { descriptor });
        localStorage.setItem('@Auth:token', res.data.token);
        api.defaults.headers.common['Authorization'] =
          `Bearer ${res.data.token}`;
        await dispatch(getCurrentUser());
        dispatch(loadCurrentUser());
        setSnackbarMessage('Login realizado com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate('/');
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setSnackbarMessage(
        err.response?.data?.errors?.[0] ||
          (mode === 'register'
            ? 'Erro ao cadastrar FaceID'
            : 'Erro ao logar com FaceID'),
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

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
            width: '100%',
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
            <Typography variant="h6">
              {mode === 'register' ? 'Cadastro de FaceID' : 'Login com FaceID'}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <video
            ref={videoRef}
            width="100%"
            height="auto"
            style={{ borderRadius: 8 }}
          />

          <Box mt={2}>
            <Button
              onClick={() => handleDetect()}
              disabled={loading}
              children={
                loading
                  ? 'Carregando modelos...'
                  : mode === 'register'
                    ? 'Detectar e Cadastrar'
                    : 'Detectar e Entrar'
              }
              variant="contained"
            />
          </Box>
        </Box>
      </Modal>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </>
  );
};

export default FaceIdPopup;
