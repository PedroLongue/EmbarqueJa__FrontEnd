import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Input from '../Input';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import { formatDateToDDMMYYYY } from '../../utils/formatDate';
import { formatCPF, formatDate } from '../../utils/inputMark';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  setFaceImage,
  setAllFaceImages,
} from '../../redux/features/faceUploadSlice';
import { setAllPassengerInfos } from '../../redux/features/searchSlice';
import * as faceapi from 'face-api.js';

type PassengerInfo = {
  name: string;
  cpf: string;
  birthDate: string;
  descriptor?: number[];
};

interface CheckoutFormProps {
  loadingImage: boolean;
  setLoadingImage: (loading: boolean) => void;
  onFormChange: (isValid: boolean) => void;
}

const CheckoutForm = ({
  onFormChange,
  setLoadingImage,
  loadingImage,
}: CheckoutFormProps) => {
  const [useBuyerInfo, setUseBuyerInfo] = useState(false);
  const passengers = useSelector((state: RootState) => state.search.passengers);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const faceImages = useSelector((state: RootState) => state.faceUpload.images);
  const dispatch = useAppDispatch();

  const {
    control,
    setValue,
    trigger,
    formState: { isValid },
  } = useForm<{ passengers: PassengerInfo[] }>({
    mode: 'onChange',
    defaultValues: {
      passengers: [...Array(passengers)].map(() => ({
        name: '',
        cpf: '',
        birthDate: '',
        descriptor: [],
      })),
    },
  });

  const values = useWatch({ control, name: 'passengers' });

  useEffect(() => {
    dispatch(
      setAllFaceImages(Array.from({ length: passengers }).map(() => null)),
    );
  }, [passengers]);

  useEffect(() => {
    if (Array.isArray(values)) {
      dispatch(setAllPassengerInfos(values));
    }
  }, [values, dispatch]);

  useEffect(() => {
    onFormChange(isValid);
  }, [isValid, onFormChange]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseBuyerInfo(event.target.checked);

    if (event.target.checked && currentUser) {
      setValue(`passengers.0`, {
        name: currentUser.name || '',
        cpf: currentUser.cpf || '',
        birthDate: formatDateToDDMMYYYY(currentUser.birthDate) || '',
        descriptor: values[0]?.descriptor || [],
      });
    } else {
      setValue(`passengers.0`, {
        name: '',
        cpf: '',
        birthDate: '',
        descriptor: [],
      });
    }

    trigger();
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;
    setLoadingImage(true);

    dispatch(setFaceImage({ index, file }));

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition'),
    ]);

    const img = await faceapi.bufferToImage(file);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return;

    const descriptor = Array.from(detection.descriptor);

    const current = values[index];
    setValue(`passengers.${index}`, {
      ...current,
      descriptor,
    });

    trigger();

    setLoadingImage(false);
  };

  return (
    <Grid item xs={12} md={7}>
      {Array.from({ length: passengers }).map((_, index) => (
        <Box
          key={index}
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: '#F8F9FA',
          }}
        >
          {index === 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={useBuyerInfo}
                  onChange={handleCheckboxChange}
                />
              }
              label="Sou o comprador da viagem e também um dos passageiros."
            />
          )}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <Controller
                name={`passengers.${index}.name`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    shrink={useBuyerInfo}
                    fullWidth
                    label="Nome do passageiro"
                    variant="outlined"
                    {...field}
                    datatestId='passanger-input-name'
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name={`passengers.${index}.cpf`}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value, ...rest } }) => (
                  <Input
                    shrink={useBuyerInfo}
                    fullWidth
                    label="CPF"
                    variant="outlined"
                    value={value}
                    onChange={(e) => onChange(formatCPF(e.target.value))}
                    {...rest}
                    datatestId='passanger-input-cpf'
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name={`passengers.${index}.birthDate`}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value, ...rest } }) => (
                  <Input
                    shrink={useBuyerInfo}
                    fullWidth
                    label="Data de nascimento"
                    variant="outlined"
                    value={value}
                    onChange={(e) => onChange(formatDate(e.target.value))}
                    {...rest}
                    datatestId='passanger-input-birthdate'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <label htmlFor={`face-image-${index}`}>
                <input
                  accept="image/*"
                  id={`face-image-${index}`}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) =>
                    handleImageChange(
                      e.target.files && e.target.files.length > 0
                        ? e.target.files[0]
                        : null,
                      index,
                    )
                  }
                />
                <Box
                  sx={{
                    'border': '2px dashed #90caf9',
                    'borderRadius': 2,
                    'p': { xs: 2, sm: 3 },
                    'textAlign': 'center',
                    'cursor': 'pointer',
                    'backgroundColor': '#f0f7ff',
                    'transition': 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  {loadingImage ? (
                    <CircularProgress size={28} />
                  ) : (
                    <>
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        mb={1}
                      >
                        <Typography
                          variant="subtitle2"
                          color="text.primary"
                          fontWeight={600}
                          fontSize={{ xs: '0.95rem', sm: '1rem' }}
                        >
                          {faceImages[index]
                            ? faceImages[index]?.name
                            : 'Clique aqui para enviar uma foto do rosto'}
                        </Typography>

                        {faceImages[index] && (
                          <CheckCircleIcon fontSize="small" color="success" />
                        )}
                      </Box>

                      {!faceImages[index] && (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                            mx="auto"
                          >
                            Essa imagem será usada na hora do embarque para
                            validar sua identidade. Assim, você não precisará
                            apresentar o QR Code.
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                            mt={1}
                            mx="auto"
                          >
                            Envie uma foto clara, em um ambiente bem iluminado e
                            de frente para a câmera.
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </Box>
              </label>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Grid>
  );
};

export default CheckoutForm;
