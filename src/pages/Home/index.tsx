import Banner from '../../assets/imgs/banner.jpg';
import SeachForm from '../../components/SearchForm';

const Home = () => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        style={{ width: ' 100%', height: '500px', objectFit: 'cover' }}
        src={Banner}
        alt="EmbarqueJa"
      />
      <SeachForm />
    </div>
  );
};

export default Home;
