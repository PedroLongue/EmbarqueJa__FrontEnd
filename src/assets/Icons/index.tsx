import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import AirIcon from '@mui/icons-material/Air';
import WcIcon from '@mui/icons-material/Wc';
import UsbIcon from '@mui/icons-material/Usb';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import TvIcon from '@mui/icons-material/Tv';
import BedIcon from '@mui/icons-material/Bed';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WifiIcon from '@mui/icons-material/Wifi';
import MicIcon from '@mui/icons-material/Mic';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type IconName =
  | 'location'
  | 'arrow'
  | 'time'
  | 'seat'
  | 'air'
  | 'wc'
  | 'usb'
  | 'water'
  | 'snack'
  | 'tv'
  | 'bed'
  | 'person'
  | 'calendar'
  | 'wifi'
  | 'mic'
  | 'visibilityPassword'
  | 'visibilityOffPassword';

interface IconProps {
  name: IconName;
}

const Icon = ({ name }: IconProps) => {
  const icons = {
    location: <LocationOnIcon />,
    arrow: <ArrowRightAltIcon />,
    time: <AccessTimeIcon />,
    seat: <AirlineSeatReclineExtraIcon />,
    air: <AirIcon />,
    wc: <WcIcon />,
    usb: <UsbIcon />,
    water: <LocalDrinkIcon />,
    snack: <FastfoodIcon />,
    tv: <TvIcon />,
    bed: <BedIcon />,
    person: <PersonIcon />,
    calendar: <CalendarTodayIcon />,
    wifi: <WifiIcon />,
    mic: <MicIcon />,
    visibilityPassword: <Visibility />,
    visibilityOffPassword: <VisibilityOff />,
  };

  return icons[name] || null;
};

export default Icon;
