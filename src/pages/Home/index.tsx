import { Container } from '@mui/material';
import Banner from '../../assets/imgs/banner.jpg';
import RenderTickets from '../../components/RenderTickets';
import SeachForm from '../../components/SearchForm';

const Home = () => {
  return (
    <Container sx={{ flex: 1, padding: '0px !important' }} maxWidth={false}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <img
          style={{ width: ' 100%', height: '500px', objectFit: 'cover' }}
          src={Banner}
          alt="EmbarqueJa"
        />
        <SeachForm />
      </div>
      <RenderTickets />
    </Container>
  );
};

export default Home;
