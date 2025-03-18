import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: '#EDEDED', color: '#1976d2', py: 4, mt: 4 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight={'bold'}>
              EmbarqueJa
            </Typography>
            <Typography variant="body2">
              Sua plataforma confiável para encontrar as melhores viagens de
              ônibus.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight={'bold'}>
              Links Rápidos
            </Typography>
            <Link href="#" color="inherit" underline="none" display="block">
              <Typography variant="body2">Sobre nós</Typography>
            </Link>
            <Link href="#" color="inherit" underline="none" display="block">
              <Typography variant="body2">Contato</Typography>
            </Link>
            <Link href="#" color="inherit" underline="none" display="block">
              <Typography variant="body2">Política de Privacidade</Typography>
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight={'bold'}>
              Siga-nos
            </Typography>
            <IconButton href="#" color="inherit" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton href="#" color="inherit" aria-label="Instagram">
              <Instagram />
            </IconButton>
            <IconButton href="#" color="inherit" aria-label="Twitter">
              <Twitter />
            </IconButton>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} EmbarqueJa. Todos os direitos
            reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
