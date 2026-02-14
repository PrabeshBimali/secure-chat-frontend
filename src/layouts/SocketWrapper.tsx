import { Outlet } from 'react-router';
import { SocketProvider } from '../context/SocketProvider';
import SocketEventsWrapper from '../components/SocketEventsWrapper';

export default function SocketWrapper(): React.ReactElement {
  return (
    <SocketProvider>
      <SocketEventsWrapper/>
      <Outlet /> 
    </SocketProvider>
  );
};