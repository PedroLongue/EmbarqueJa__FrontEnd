import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useMemo } from 'react';

const PrivacyPolicy = () => {
  const lastUpdated = useMemo(() => '20/09/2025', []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Política de Privacidade
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Última atualização: {lastUpdated}
          </Typography>
        </Box>

        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ padding: 2 }}>
            <Typography variant="body1" paragraph>
              Este documento descreve como tratamos seus dados pessoais em
              conformidade com a Lei Geral de Proteção de Dados (Lei nº
              13.709/2018 — LGPD). Nosso objetivo é assegurar transparência,
              segurança e respeito aos direitos dos titulares.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              1. Dados coletados
            </Typography>
            <Typography variant="body1" component="div" padding={2}>
              <ul style={{ marginTop: 0 }}>
                <li>
                  <strong>Dados cadastrais:</strong> nome completo, e-mail, data
                  de nascimento e CPF.
                </li>
                <li>
                  <strong>Credenciais de acesso:</strong> senhas armazenadas
                  <em> exclusivamente como hash</em> (nunca em texto puro).
                </li>
                <li>
                  <strong>Dados de viagem:</strong> origem, destino, data e
                  assento.
                </li>
                <li>
                  <strong>Dados biométricos para reconhecimento facial:</strong>{' '}
                  armazenamos <em>apenas o vetor de pontos</em> (embedding de{' '}
                  <strong>124 posições</strong>), suficiente para verificação
                  algorítmica de identidade; <u>não</u> armazenamos fotos ou
                  imagens faciais.
                </li>
              </ul>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              2. Finalidades do tratamento
            </Typography>
            <Typography variant="body1" component="div" padding={2}>
              <ul style={{ marginTop: 0 }}>
                <li>Realizar cadastro, autenticação e login do usuário.</li>
                <li>
                  Possibilitar a busca e compra de passagens e emitir
                  comprovante com QR Code.
                </li>
                <li>Enviar comprovantes e comunicações por e-mail.</li>
                <li>
                  Validar passageiros no embarque por meio do reconhecimento
                  facial (usando somente o vetor).
                </li>
                <li>
                  Oferecer recursos de acessibilidade, como comandos de voz.
                </li>
              </ul>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              3. Pagamentos
            </Typography>
            <Typography variant="body1" paragraph>
              As formas de pagamento são{' '}
              <strong>simuladas para fins acadêmicos</strong>, sem processamento
              financeiro real. Não coletamos nem armazenamos dados de cartão de
              crédito ou débito.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              4. Compartilhamento
            </Typography>
            <Typography variant="body1" paragraph>
              Não compartilhamos seus dados com terceiros, salvo por obrigação
              legal ou ordem de autoridade competente.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              5. Segurança
            </Typography>
            <Typography variant="body1" component="div" padding={2}>
              <ul style={{ marginTop: 0 }}>
                <li>
                  Conexões protegidas por <strong>HTTPS</strong>.
                </li>
                <li>
                  Senhas protegidas por algoritmos de <strong>hash</strong>.
                </li>
                <li>
                  Dados biométricos armazenados como{' '}
                  <strong>vetores numéricos</strong> não reversíveis (não
                  permitem reconstrução de imagem facial).
                </li>
              </ul>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" color="text.secondary">
              Ao utilizar o sistema, você declara estar ciente e de acordo com
              os termos desta Política de Privacidade.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default PrivacyPolicy;
